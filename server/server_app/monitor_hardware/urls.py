from django.urls import path
from . import views

urlpatterns = [
    path(
        "monitor-hardwares/",
        views.MonitorHardwareListCreateView.as_view(),
        name="monitor-hardware-list-create-view",
    ),
    path(
        "monitor-hardwares/<uuid:pk>/",
        views.MonitorHardwareRetrieveUpdateDestroyView.as_view(),
        name="monitor-hardware-retrieve-update-destroy-view",
    ),
]
