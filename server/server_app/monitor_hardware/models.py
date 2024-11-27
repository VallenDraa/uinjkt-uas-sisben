import uuid
from django.db import models


class MonitorHardwareModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    hardware_code = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.hardware_code
