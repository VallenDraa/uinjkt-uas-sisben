import uuid
from django.db import models


class BabyNotificationModel(models.Model):
    class NotificationTitle(models.TextChoices):
        CRYING = "crying", "Crying"
        DISCOMFORT = "discomfort", "Discomfort"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4)

    hardware_id = models.ForeignKey(
        "monitor_hardware.MonitorHardwareModel", on_delete=models.CASCADE
    )
    title = models.CharField(
        max_length=255,
        choices=NotificationTitle.choices,
    )
    picture = models.ImageField(upload_to="baby_pictures/")
    clarification = models.TextField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.hardware_id}"
