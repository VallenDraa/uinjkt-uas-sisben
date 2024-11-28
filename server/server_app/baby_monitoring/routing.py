from django.urls import re_path
from .consumers import BabyStreamingTempsHumidityConsumer, BabyStreamingVideoConsumer

websocket_urlpatterns = [
    re_path(
        "ws/baby-monitoring/video",
        BabyStreamingVideoConsumer.as_asgi(),
        name="baby-monitoring-video",
    ),
    re_path(
        "ws/baby-monitoring/temps-humidity",
        BabyStreamingTempsHumidityConsumer.as_asgi(),
        name="baby-monitoring-video",
    ),
]
