import json
from pathlib import Path
import time
import wave
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from io import BytesIO
from PIL import Image
from django.core.files.images import ImageFile
from baby_notification.models import BabyNotificationModel
from monitor_hardware.models import MonitorHardwareModel
from .ai.predict_is_crying import predict_is_crying
from .ai.predict_is_uncomfortable import predict_is_uncomfortable

global_temps_humidity = {}

last_uncomfortable_prediction = {}
last_crying_prediction = {}

UNCOMFORTABLE_PREDICTION_COOLDOWN = 5
CRYING_PREDICTION_COOLDOWN = 5

# Notification threshold settings
notification_counters = {}
NOTIFICATION_THRESHOLD = 5
NOTIFICATION_WINDOW = 5


def should_save_notification(hardware_id):
    current_time = time.time()
    count, first_time = notification_counters.get(hardware_id, (0, current_time))
    if current_time - first_time <= NOTIFICATION_WINDOW:
        count += 1
    else:
        count = 1
        first_time = current_time
    notification_counters[hardware_id] = (count, first_time)

    if count >= NOTIFICATION_THRESHOLD:
        notification_counters[hardware_id] = (0, current_time)
        return True
    else:
        return False


class BabyMonitoringVideoConsumer(WebsocketConsumer):
    def connect(self):
        self.hardware_id = self.scope["url_route"]["kwargs"]["hardware_id"]
        self.room_group_name = f"video_stream_{self.hardware_id}"

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name,
        )

        self.accept()

    def websocket_receive(self, message):
        if "bytes" in message and message["bytes"]:
            self.receive(bytes_data=message["bytes"])

    def receive(self, bytes_data=None):
        if bytes_data:
            try:
                # Save the image
                image = Image.open(BytesIO(bytes_data))
                IMAGES_DIR = Path("./baby_monitoring/images")
                IMAGES_DIR.mkdir(exist_ok=True)
                image_path = IMAGES_DIR / f"{self.hardware_id}_video_frame.jpeg"
                image.save(image_path, format="JPEG")

                temps_humidity = global_temps_humidity.get(self.hardware_id, {})
                monitor_hardware = MonitorHardwareModel.objects.get(id=self.hardware_id)

                # Throttle predict_is_uncomfortable calls
                current_time = time.time()
                last_prediction_time = last_uncomfortable_prediction.get(
                    self.hardware_id, 0
                )

                if (
                    current_time - last_prediction_time
                    >= UNCOMFORTABLE_PREDICTION_COOLDOWN
                ):
                    is_baby_uncomfortable = predict_is_uncomfortable(image_path)
                    last_uncomfortable_prediction[self.hardware_id] = current_time

                    if is_baby_uncomfortable:
                        temps_humidity = global_temps_humidity.get(self.hardware_id, {})
                        monitor_hardware = MonitorHardwareModel.objects.get(
                            id=self.hardware_id
                        )

                        if should_save_notification(self.hardware_id):
                            with open(image_path, "rb") as img_file:
                                notification = BabyNotificationModel.objects.create(
                                    hardware_id=monitor_hardware,
                                    title="Bayi Terlihat Tidak Nyaman!",
                                    picture=ImageFile(img_file, name=image_path.name),
                                    temp_celcius=temps_humidity.get("temp_celcius", 0),
                                    temp_farenheit=temps_humidity.get(
                                        "temp_farenheit", 0
                                    ),
                                    humidity=temps_humidity.get("humidity", 0),
                                )

                                async_to_sync(self.channel_layer.group_send)(
                                    self.room_group_name,
                                    {
                                        "type": "uncomfortable.message",
                                        "sender_channel_name": self.channel_name,
                                        "time": notification.created_at.strftime(
                                            "%Y-%m-%d %H:%M:%S"
                                        ),
                                    },
                                )
                            img_file.close()
                        else:
                            async_to_sync(self.channel_layer.group_send)(
                                self.room_group_name,
                                {
                                    "type": "uncomfortable.message",
                                    "sender_channel_name": self.channel_name,
                                    "time": time.strftime("%Y-%m-%d %H:%M:%S"),
                                },
                            )

                self.send(text_data=json.dumps({"message": "Video image received."}))
            except Exception as e:
                print(f"Failed to process image: {e}")
                self.send(text_data=json.dumps({"message": "Failed to process image."}))

    def uncomfortable_message(self, event):

        if event["sender_channel_name"] != self.channel_name:
            self.send(
                text_data=json.dumps(
                    {
                        "message": f"Bayi terdeksi tidak nyaman pada {event['time']}",
                    }
                )
            )

    def disconnect(self, code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )


class BabyMonitoringAudioConsumer(WebsocketConsumer):
    def connect(self):
        self.hardware_id = self.scope["url_route"]["kwargs"]["hardware_id"]
        self.room_group_name = f"audio_stream_{self.hardware_id}"

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name,
        )

        self.accept()

        AUDIO_DIR = Path("./baby_monitoring/audio")
        AUDIO_DIR.mkdir(exist_ok=True)
        self.audio_path = AUDIO_DIR / f"{self.hardware_id}_audio_chunk.wav"

        # Initialize audio buffer and metadata
        self.audio_buffer = b""
        self.max_duration_frames = 10 * 44100  # 10 seconds in frames
        self.sample_rate = 44100
        self.sample_width = 2
        self.channels = 1

        # Create or reset the WAV file
        self._reset_audio_file()

    def _reset_audio_file(self):
        """
        Creates or overwrites the WAV file with the current buffer.
        """
        with wave.open(str(self.audio_path), "wb") as audio_file:
            audio_file.setnchannels(self.channels)
            audio_file.setsampwidth(self.sample_width)
            audio_file.setframerate(self.sample_rate)
            audio_file.writeframes(self.audio_buffer)
            audio_file.close()

    def websocket_receive(self, message):
        if "bytes" in message and message["bytes"]:
            self.receive(bytes_data=message["bytes"])

    def receive(self, bytes_data=None):
        if bytes_data:
            try:
                # Append new data to the buffer
                self.audio_buffer += bytes_data
                frames_in_buffer = len(self.audio_buffer) // (
                    self.sample_width * self.channels
                )

                # Trim the buffer to maintain the last 10 seconds
                if frames_in_buffer > self.max_duration_frames:
                    bytes_to_keep = (
                        self.max_duration_frames * self.sample_width * self.channels
                    )
                    self.audio_buffer = self.audio_buffer[-bytes_to_keep:]

                # Save the trimmed buffer to the WAV file
                self._reset_audio_file()

                # Throttle `predict_is_crying` calls
                current_time = time.time()
                last_prediction_time = last_crying_prediction.get(self.hardware_id, 0)

                if current_time - last_prediction_time >= CRYING_PREDICTION_COOLDOWN:
                    is_baby_crying = predict_is_crying(self.audio_path)
                    last_crying_prediction[self.hardware_id] = current_time

                    if is_baby_crying:
                        temps_humidity = global_temps_humidity.get(self.hardware_id, {})
                        monitor_hardware = MonitorHardwareModel.objects.get(
                            id=self.hardware_id
                        )
                        IMAGES_DIR = Path("./baby_monitoring/images")
                        IMAGES_DIR.mkdir(exist_ok=True)
                        image_path = IMAGES_DIR / f"{self.hardware_id}_video_frame.jpeg"

                        if should_save_notification(self.hardware_id):
                            with open(image_path, "rb") as img_file:
                                notification = BabyNotificationModel.objects.create(
                                    hardware_id=monitor_hardware,
                                    title="Bayi Menangis!",
                                    picture=ImageFile(img_file, name=image_path.name),
                                    temp_celcius=temps_humidity.get("temp_celcius", 0),
                                    temp_farenheit=temps_humidity.get(
                                        "temp_farenheit", 0
                                    ),
                                    humidity=temps_humidity.get("humidity", 0),
                                )

                                async_to_sync(self.channel_layer.group_send)(
                                    self.room_group_name,
                                    {
                                        "type": "crying.message",
                                        "sender_channel_name": self.channel_name,
                                        "time": notification.created_at.strftime(
                                            "%Y-%m-%d %H:%M:%S"
                                        ),
                                        "crying_detected": True,
                                    },
                                )

                            img_file.close()

                        else:
                            async_to_sync(self.channel_layer.group_send)(
                                self.room_group_name,
                                {
                                    "type": "crying.message",
                                    "sender_channel_name": self.channel_name,
                                    "time": time.strftime("%Y-%m-%d %H:%M:%S"),
                                    "crying_detected": True,
                                },
                            )

                self.send(text_data=json.dumps({"message": "Audio chunk received."}))

            except Exception as e:
                print(f"Failed to process audio: {e}")
                self.send(text_data=json.dumps({"message": "Failed to process audio."}))

    def crying_message(self, event):
        if event["sender_channel_name"] != self.channel_name:
            self.send(
                text_data=json.dumps(
                    {"message": f"Bayi terdeteksi menangis pada {event['time']}"}
                )
            )

    def disconnect(self, code):
        # Close the WAV file
        self._reset_audio_file()
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )


class BabyMonitoringTempsHumidityConsumer(WebsocketConsumer):
    def connect(self):
        self.hardware_id = self.scope["url_route"]["kwargs"]["hardware_id"]
        self.room_group_name = f"chat_{self.hardware_id}"

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )

        self.accept()

    def websocket_receive(self, message):
        if "text" in message and message["text"]:
            self.receive(text_data=message["text"])

    def receive(self, text_data=None):
        data = json.loads(text_data)

        # Update shared state
        global_temps_humidity[self.hardware_id] = {
            "temp_celcius": data["temp_celcius"],
            "temp_farenheit": data["temp_farenheit"],
            "humidity": data["humidity"],
        }

        if (
            data["humidity"] > 80
            or data["temp_celcius"] > 35
            or data["temp_farenheit"] > 95
        ):
            monitor_hardware = MonitorHardwareModel.objects.get(id=self.hardware_id)
            notification_title = ""
            if data["humidity"] > 80:
                notification_title += "Terlalu lembab. "
            if data["temp_celcius"] > 35 or data["temp_farenheit"] > 95:
                notification_title += "Terlalu panas."

            if should_save_notification(self.hardware_id):
                IMAGES_DIR = Path("./baby_monitoring/images")
                IMAGES_DIR.mkdir(exist_ok=True)
                image_path = IMAGES_DIR / f"{self.hardware_id}_video_frame.jpeg"

                with open(image_path, "rb") as img_file:
                    BabyNotificationModel.objects.create(
                        hardware_id=monitor_hardware,
                        picture=ImageFile(img_file, name=image_path.name),
                        title=notification_title.strip(),
                        temp_celcius=data["temp_celcius"],
                        temp_farenheit=data["temp_farenheit"],
                        humidity=data["humidity"],
                    )

                    img_file.close()

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                "type": "temps_humidity.message",
                "sender_channel_name": self.channel_name,
                "temp_celcius": data["temp_celcius"],
                "temp_farenheit": data["temp_farenheit"],
                "humidity": data["humidity"],
            },
        )

    def temps_humidity_message(self, event):
        # Exclude the sender from receiving their own broadcast
        if event["sender_channel_name"] != self.channel_name:
            message = ""

            is_too_humid = event["humidity"] > 80
            is_too_hot = event["temp_celcius"] > 35 and event["temp_farenheit"] > 95

            if is_too_humid:
                message += "\nTerlalu lembab, tingkat kelembaban yang baik bagi bayi adalah dibawah 70%."
            if is_too_hot:
                message += "\nTerlalu panas, suhu yang baik bagi bayi adalah dibawah 30°C atau 86°F."

            self.send(
                text_data=json.dumps(
                    {
                        "message": (None if message == "" else message),
                        "temp_celcius": event["temp_celcius"],
                        "temp_farenheit": event["temp_farenheit"],
                        "humidity": event["humidity"],
                    }
                )
            )

    def disconnect(self, code):
        global_temps_humidity.pop(self.hardware_id, None)

        # Remove the client from the group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )
