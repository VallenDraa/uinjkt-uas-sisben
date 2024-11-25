from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView

from .serializers import BabyScheduleSerializer
from .models import BabySchedule


class BabyScheduleListCreateView(ListCreateAPIView):
    queryset = BabySchedule.objects.all()
    serializer_class = BabyScheduleSerializer


class BabyScheduleRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    queryset = BabySchedule.objects.all()
    serializer_class = BabyScheduleSerializer
