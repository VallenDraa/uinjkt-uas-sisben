import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync


class BabyMonitoringVideoConsumer(WebsocketConsumer):
    def connect(self):
        self.hardware_code = self.scope["url_route"]["kwargs"]["hardware_code"]
        self.room_group_name = f"chat_{self.hardware_code}"

        # Add the client to the group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )

        # Accept the WebSocket connection
        self.accept()

    def receive(self, text_data):
        # Process incoming data
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                "type": "video.message",
                "message": f"Hey, this is your message: {text_data}",
            },
        )

    def video_message(self, event):
        # Send the group message to the WebSocket
        self.send(text_data=json.dumps({"message": event["message"]}))

    def disconnect(self, code):
        # Remove the client from the group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )


class BabyMonitoringTempsHumidityConsumer(WebsocketConsumer):
    def connect(self):
        self.hardware_code = self.scope["url_route"]["kwargs"]["hardware_code"]
        self.room_group_name = f"chat_{self.hardware_code}"

        # Add the client to the group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )

        # Accept the WebSocket connection
        self.accept()

    def receive(self, text_data=None):
        # Parse the received data
        data = json.loads(text_data)

        # Broadcast the data to the group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                "type": "temps_humidity.message",
                "tempCelcius": data["tempCelcius"],
                "tempFarenheit": data["tempFarenheit"],
                "humidity": data["humidity"],
            },
        )

    def temps_humidity_message(self, event):
        # Send the data to the WebSocket
        self.send(
            text_data=json.dumps(
                {
                    "tempCelcius": event["tempCelcius"],
                    "tempFarenheit": event["tempFarenheit"],
                    "humidity": event["humidity"],
                }
            )
        )

    def disconnect(self, code):
        # Remove the client from the group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )
