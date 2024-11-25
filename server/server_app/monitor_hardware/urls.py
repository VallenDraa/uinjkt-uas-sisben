from django.urls import path
from . import views

urlpatterns = [
    path(
        "monitor-hardware/",
        views.MonitorHardwareListCreateView.as_view(),
        name="monitor-hardware-list-create-view",
    ),
    path(
        "monitor-hardware/<uuid:pk>/",
        views.MonitorHardwareRetrieveUpdateDestroyView.as_view(),
        name="monitor-hardware-retrieve-update-destroy-view",
    ),
]