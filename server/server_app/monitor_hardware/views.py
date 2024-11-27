from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView

from .filters import MonitorHardwareFilter
from .serializers import MonitorHardwareSerializer
from .models import MonitorHardwareModel


class MonitorHardwareListCreateView(ListCreateAPIView):
    queryset = MonitorHardwareModel.objects.all()
    serializer_class = MonitorHardwareSerializer
    filterset_class = MonitorHardwareFilter
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    search_fields = ["hardware_code"]
    ordering_fields = ["created_at"]


class MonitorHardwareRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    queryset = MonitorHardwareModel.objects.all()
    serializer_class = MonitorHardwareSerializer
