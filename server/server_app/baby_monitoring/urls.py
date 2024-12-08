from django.urls import path
from .views import VideoStreamView, AudioStreamView

urlpatterns = [
    path(
        "baby-monitoring/video/<str:hardware_id>/",
        VideoStreamView.as_view(),
        name="baby-monitoring-video-stream",
    ),
    path(
        "baby-monitoring/audio/<str:hardware_id>/",
        AudioStreamView.as_view(),
        name="baby-monitoring-audio-stream",
    ),
]
