from django.urls import path
from . import views

urlpatterns = [
    path(
        "baby-schedules/",
        views.BabyScheduleListCreateView.as_view(),
        name="baby-schedule-list-create-view",
    ),
    path(
        "baby-schedules/<uuid:pk>/",
        views.BabyScheduleRetrieveUpdateDestroyView.as_view(),
        name="baby-schedule-retrieve-update-destroy-view",
    ),
]
