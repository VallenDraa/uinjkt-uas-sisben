from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend


from .filters import BabyScheduleFilter
from .serializers import BabyScheduleSerializer
from .models import BabyScheduleModel


class BabyScheduleListCreateView(ListCreateAPIView):
    queryset = BabyScheduleModel.objects.all()
    serializer_class = BabyScheduleSerializer
    filterset_class = BabyScheduleFilter
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    search_fields = ["title", "description"]
    ordering_fields = ["created_at"]


class BabyScheduleRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    queryset = BabyScheduleModel.objects.all()
    serializer_class = BabyScheduleSerializer
