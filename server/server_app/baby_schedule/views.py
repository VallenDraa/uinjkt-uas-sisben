from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from baby_notification.models import BabyNotificationModel
from .utils.organize_schedules_parts_of_day import organize_schedules_parts_of_day
from .filters import BabyScheduleFilter
from .serializers import OrganizedSchedulesSerializer
from .models import BabyScheduleModel
from .utils.generate_schedules import generate_schedules, client


class BabyScheduleViewSet(viewsets.ViewSet):
    lookup_field = "pk"
    hardware_id = None

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    search_fields = ["title", "description"]
    ordering_fields = ["created_at"]

    def list(self, request, hardware_id=None):
        self.hardware_id = hardware_id
        queryset = BabyScheduleModel.objects.all()

        if self.hardware_id:
            queryset = queryset.filter(hardware_id=self.hardware_id)

        filterset = BabyScheduleFilter(request.GET, queryset=queryset)
        schedules = filterset.qs

        organized_schedules = organize_schedules_parts_of_day(schedules)

        response_data = OrganizedSchedulesSerializer(
            organized_schedules, many=True
        ).data

        return Response(response_data)

    def retrieve(self, request, hardware_id=None, pk=None):
        self.hardware_id = hardware_id
        try:
            schedule = BabyScheduleModel.objects.get(pk=pk, hardware_id=hardware_id)
        except BabyScheduleModel.DoesNotExist:
            return Response(
                {"error": "Schedule not found"}, status=status.HTTP_404_NOT_FOUND
            )

        organized_schedules = organize_schedules_parts_of_day([schedule])

        response_data = OrganizedSchedulesSerializer(
            organized_schedules, many=True
        ).data

        return Response(response_data)

    def destroy(self, request, hardware_id=None, pk=None):
        self.hardware_id = hardware_id
        try:
            schedule = BabyScheduleModel.objects.get(pk=pk, hardware_id=hardware_id)
        except BabyScheduleModel.DoesNotExist:
            return Response(
                {"error": "Schedule not found"}, status=status.HTTP_404_NOT_FOUND
            )

        schedule.delete()
        return Response(
            {"message": "Schedule deleted successfully"},
            status=status.HTTP_204_NO_CONTENT,
        )

    @action(detail=False, methods=["post"], url_path="generate")
    def generate(self, request, hardware_id=None):
        self.hardware_id = hardware_id

        # Delete existing schedules for the hardware ID
        BabyScheduleModel.objects.filter(hardware_id=hardware_id).delete()

        # Filter notifications within a timeframe provided in the request
        filterset = BabyScheduleFilter(
            request.query_params, queryset=BabyNotificationModel.objects.all()
        )
        notifications = filterset.qs

        # Generate new schedules
        new_schedules = generate_schedules(client, notifications)

        # Create new schedule instances
        bulk_schedules = [
            BabyScheduleModel(hardware_id=hardware_id, **schedule)
            for schedule in new_schedules
        ]
        BabyScheduleModel.objects.bulk_create(bulk_schedules)

        response_data = OrganizedSchedulesSerializer(bulk_schedules, many=True).data

        return Response(
            response_data,
            status=status.HTTP_201_CREATED,
        )
