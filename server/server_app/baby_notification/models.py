import uuid
from django.db import models


class BabyNotificationModel(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4)

    hardware_id = models.ForeignKey(
        "monitor_hardware.MonitorHardwareModel", on_delete=models.CASCADE
    )
    title = models.CharField(max_length=255)
    picture = models.ImageField(upload_to="baby_pictures/")
    temp_celcius = models.FloatField(default=0)
    temp_farenheit = models.FloatField(default=0)
    humidity = models.FloatField(default=0)
    clarification = models.TextField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.hardware_id}"
