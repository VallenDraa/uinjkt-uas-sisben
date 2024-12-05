from django.db import models


class MonitorHardwareModel(models.Model):
    id = models.CharField(primary_key=True, max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.id
