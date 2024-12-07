import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from io import BytesIO
from PIL import Image


class BabyMonitoringVideoConsumer(WebsocketConsumer):
    def connect(self):
        self.hardware_id = self.scope["url_route"]["kwargs"]["hardware_id"]
        self.room_group_name = f"video_stream_{self.hardware_id}"

        # Add the client to the group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )

        # Accept the WebSocket connection
        self.accept()

    def websocket_receive(self, message):
        if "bytes" in message and message["bytes"]:
            self.receive(bytes_data=message["bytes"])

    def receive(self, bytes_data=None):
        if bytes_data:
            try:
                # Verify and process the received image
                image = Image.open(BytesIO(bytes_data))
                img_io = BytesIO()
                image.save(img_io, format="JPEG")
                img_io.seek(0)

                # Broadcast the binary image data to the group
                async_to_sync(self.channel_layer.group_send)(
                    self.room_group_name,
                    {
                        "type": "send_video_frame",
                        "frame": img_io.read(),
                    },
                )

            except Exception as e:
                print(f"Failed to process image: {e}")

    def send_video_frame(self, event):
        self.send(bytes_data=event["frame"])

    def disconnect(self, code):
        # Remove the client from the group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )


class BabyMonitoringTempsHumidityConsumer(WebsocketConsumer):
    def connect(self):
        self.hardware_id = self.scope["url_route"]["kwargs"]["hardware_id"]
        self.room_group_name = f"chat_{self.hardware_id}"

        # Add the client to the group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )

        # Accept the WebSocket connection
        self.accept()

    def websocket_receive(self, message):
        if "text" in message and message["text"]:
            self.receive(text_data=message["text"])

    def receive(self, text_data=None):
        # Parse the received data
        data = json.loads(text_data)

        # Broadcast the data to the group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                "type": "temps_humidity.message",
                "temp_celcius": data["temp_celcius"],
                "temp_farenheit": data["temp_farenheit"],
                "humidity": data["humidity"],
            },
        )

    def temps_humidity_message(self, event):
        # Send the data to the WebSocket
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
