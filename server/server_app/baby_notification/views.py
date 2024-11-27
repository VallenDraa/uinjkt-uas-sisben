from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend

from .filters import BabyNotificationFilter
from .serializers import BabyNotificationSerializer
from .models import BabyNotificationModel


class BabyNotificationListCreateView(ListCreateAPIView):
    queryset = BabyNotificationModel.objects.all()
    serializer_class = BabyNotificationSerializer
    filterset_class = BabyNotificationFilter
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    search_fields = ["title", "clarification"]
    ordering_fields = ["created_at"]


class BabyNotificationRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    queryset = BabyNotificationModel.objects.all()
    serializer_class = BabyNotificationSerializer
