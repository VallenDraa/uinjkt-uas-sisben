from django.urls import re_path
from .consumers import BabyMonitoringTempsHumidityConsumer, BabyMonitoringVideoConsumer

websocket_urlpatterns = [
    re_path(
        r"ws/baby-monitoring/video/(?P<hardware_id>\w+)/$",
        BabyMonitoringVideoConsumer.as_asgi(),
        name="baby-monitoring-video",
    ),
    re_path(
        r"^ws/baby-monitoring/temps-humidity/(?P<hardware_id>[\w\-]+)/$",
        BabyMonitoringTempsHumidityConsumer.as_asgi(),
        name="baby-monitoring-temps-humidity",
    ),
]
