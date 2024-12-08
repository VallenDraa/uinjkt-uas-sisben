import json
from pathlib import Path
import wave
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from io import BytesIO
from PIL import Image


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
                image = Image.open(BytesIO(bytes_data))

                IMAGES_DIR = Path("./baby_monitoring/images")
                IMAGES_DIR.mkdir(exist_ok=True)

                image_path = IMAGES_DIR / f"{self.hardware_id}_video_frame.jpeg"
                image.save(image_path, format="JPEG")

                self.send(text_data=json.dumps({"message": "Video image received."}))

            except Exception as e:
                print(f"Failed to process image: {e}")
                self.send(text_data=json.dumps({"error": "Failed to process image."}))

    def disconnect(self, code):
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
            self.send(
                text_data=json.dumps(
                    {
                        "temp_celcius": event["temp_celcius"],
                        "temp_farenheit": event["temp_farenheit"],
                        "humidity": event["humidity"],
                    }
                )
            )

    def disconnect(self, code):
        # Remove the client from the group
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
        self.audio_file = wave.open(str(self.audio_path), "wb")

        self.audio_file.setnchannels(1)  # Mono audio
        self.audio_file.setsampwidth(2)  # 16-bit audio
        self.audio_file.setframerate(16000)  # Sampling rate

    def websocket_receive(self, message):
        if "bytes" in message and message["bytes"]:
            self.receive(bytes_data=message["bytes"])

    def receive(self, bytes_data=None):
        if bytes_data:
            try:
                # Write raw PCM data to WAV file
                self.audio_file.writeframes(bytes_data)

                self.send(text_data=json.dumps({"message": "Audio chunk received."}))
            except Exception as e:
                print(f"Failed to process audio: {e}")
                self.send(text_data=json.dumps({"error": "Failed to process audio."}))

    def disconnect(self, code):
        # Close the WAV file
        if self.audio_file:
            self.audio_file.close()

        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )
