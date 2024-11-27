import uuid
from django.db import models


class BabyScheduleModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    hardware_id = models.ForeignKey(
        "monitor_hardware.MonitorHardwareModel", on_delete=models.CASCADE
    )
    title = models.CharField(max_length=255)
    description = models.TextField(null=True)
    time = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.hardware_id)
