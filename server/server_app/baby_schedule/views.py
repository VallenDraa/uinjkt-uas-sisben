import json
from django.core.serializers.json import DjangoJSONEncoder
from rest_framework import viewsets, status, filters
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from baby_notification.models import BabyNotificationModel
from monitor_hardware.models import MonitorHardwareModel
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
                {"message": "Schedule not found"}, status=status.HTTP_404_NOT_FOUND
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
                {"message": "Schedule not found"}, status=status.HTTP_404_NOT_FOUND
            )

        schedule.delete()
        return Response(
            {"message": "Schedule deleted successfully"},
            status=status.HTTP_204_NO_CONTENT,
        )

    def create(self, request, hardware_id=None):
        self.hardware_id = hardware_id

        try:
            hardware_instance = MonitorHardwareModel.objects.get(id=hardware_id)
        except MonitorHardwareModel.DoesNotExist:
            return Response(
                {"message": f"Hardware with code '{hardware_id}' not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        BabyScheduleModel.objects.filter(hardware_id=hardware_id).delete()

        # Extract filter data from the request body
        notification_from = request.data.get("notification_from")
        notification_to = request.data.get("notification_to")

        # Validate that the required fields are present
        if not notification_from or not notification_to:
            return Response(
                {
                    "message": "Both 'notification_from' and 'notification_to' are required."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Filter notifications within the specified timeframe
        notifications_queryset = BabyNotificationModel.objects.filter(
            hardware_id=hardware_instance,
            created_at__gte=notification_from,
            created_at__lte=notification_to,
        )
        notifications_data = list(
            notifications_queryset.filter(clarification__isnull=False)
            .exclude(clarification="")
            .values()
        )

        if len(notifications_data) is 0:
            return Response(
                {
                    "message": "No notifications are present, either all of the clarifications are empty or there are no notifications at all."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if len(notifications_data) > 100:
            return Response(
                {"message": "Too many notifications to process."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        is_all_clarification_empty = True
        for notification in notifications_data:
            if (
                notification["clarification"] != None
                and len(notification["clarification"]) > 0
            ):
                is_all_clarification_empty = False
                break

        if is_all_clarification_empty:
            return Response(
                {"message": "All clarification are empty."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        new_schedules = generate_schedules(
            client, json.dumps(notifications_data, cls=DjangoJSONEncoder)
        )
        bulk_schedules = BabyScheduleModel.objects.bulk_create(
            [
                BabyScheduleModel(hardware_id=hardware_instance, **schedule)
                for schedule in new_schedules["values"]
            ]
        )

        organized_schedules = organize_schedules_parts_of_day(bulk_schedules)
        response_data = OrganizedSchedulesSerializer(
            organized_schedules, many=True
        ).data
        return Response(
            {"values": response_data, "message": new_schedules["message"]},
            status=status.HTTP_201_CREATED,
        )
