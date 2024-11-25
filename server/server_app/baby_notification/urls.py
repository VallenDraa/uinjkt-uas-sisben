from django.urls import path
from . import views

urlpatterns = [
    path(
        "baby-notifications/",
        views.BabyNotificationListCreateView.as_view(),
        name="baby-notification-list-create-view",
    ),
    path(
        "baby-notifications/<int:pk>/",
        views.BabyNotificationRetrieveUpdateDestroyView.as_view(),
        name="baby-notification-retrieve-update-destroy-view",
    ),
]
