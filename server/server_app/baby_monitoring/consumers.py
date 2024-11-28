import json
from channels.generic.websocket import WebsocketConsumer


class BabyStreamingVideoConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        self.send(text_data=json.dumps({"message": "Connected to video live feed"}))

    def receive(self, text_data):
        self.send(
            text_data=json.dumps({"message": f"Hey this is your message: {text_data}"})
        )

    def disconnect(self, code):
        return super().disconnect(code)


class BabyStreamingTempsHumidityConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        self.send(
            text_data=json.dumps(
                {"message": "Connected to temperature and humidity live feed"}
            )
        )

    def receive(self, text_data=None, bytes_data=None):
        return super().receive(text_data, bytes_data)

    def disconnect(self, code):
        return super().disconnect(code)
