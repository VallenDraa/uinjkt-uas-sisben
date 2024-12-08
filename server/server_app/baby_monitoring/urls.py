from django.urls import path
from .views import VideoStreamView

urlpatterns = [
    path(
        "baby-monitoring/video/<str:hardware_id>/",
        VideoStreamView.as_view(),
        name="baby-monitoring-video-stream",
    ),
]
