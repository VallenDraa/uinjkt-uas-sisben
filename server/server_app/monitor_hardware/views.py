from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView

from .serializers import MonitorHardwareSerializer
from .models import MonitorHardware


class MonitorHardwareListCreateView(ListCreateAPIView):
    queryset = MonitorHardware.objects.all()
    serializer_class = MonitorHardwareSerializer


class MonitorHardwareRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    queryset = MonitorHardware.objects.all()
    serializer_class = MonitorHardwareSerializer
