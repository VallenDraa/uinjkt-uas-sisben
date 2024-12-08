from django.urls import re_path
from .consumers import (
    BabyMonitoringAudioConsumer,
    BabyMonitoringTempsHumidityConsumer,
    BabyMonitoringVideoConsumer,
)

websocket_urlpatterns = [
    re_path(
        r"ws/baby-monitoring/video/(?P<hardware_id>\w+)/$",
        BabyMonitoringVideoConsumer.as_asgi(),
        name="baby-monitoring-video-receive",
    ),
    re_path(
        r"ws/baby-monitoring/audio/(?P<hardware_id>\w+)/$",
        BabyMonitoringAudioConsumer.as_asgi(),
        name="baby-monitoring-audio-receive",
    ),
    re_path(
        r"^ws/baby-monitoring/temps-humidity/(?P<hardware_id>[\w\-]+)/$",
        BabyMonitoringTempsHumidityConsumer.as_asgi(),
        name="baby-monitoring-temps-humidity",
    ),
]
