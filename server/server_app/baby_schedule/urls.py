from rest_framework.routers import SimpleRouter
from django.urls import path
from .views import BabyScheduleViewSet

router = SimpleRouter()

urlpatterns = [
    path(
        "baby-schedules/<str:hardware_id>/",
        BabyScheduleViewSet.as_view({"get": "list", "post": "generate"}),
        name="baby-schedules-list",
    ),
    path(
        "baby-schedules/<str:hardware_id>/<uuid:pk>/",
        BabyScheduleViewSet.as_view({"get": "retrieve", "delete": "destroy"}),
        name="baby-schedules-detail",
    ),
]
