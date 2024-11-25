from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView

from .serializers import BabyNotificationSerializer
from .models import BabyNotification


class BabyNotificationListCreateView(ListCreateAPIView):
    queryset = BabyNotification.objects.all()
    serializer_class = BabyNotificationSerializer


class BabyNotificationRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    queryset = BabyNotification.objects.all()
    serializer_class = BabyNotificationSerializer
