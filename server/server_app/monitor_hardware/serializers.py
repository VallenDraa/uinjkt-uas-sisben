from rest_framework import serializers
from .models import MonitorHardwareModel


class MonitorHardwareSerializer(serializers.ModelSerializer):
    class Meta:
        model = MonitorHardwareModel
        fields = "__all__"
