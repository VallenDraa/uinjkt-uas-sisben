from rest_framework import serializers
from .models import MonitorHardware


class MonitorHardwareSerializer(serializers.ModelSerializer):
    class Meta:
        model = MonitorHardware
        fields = "__all__"
