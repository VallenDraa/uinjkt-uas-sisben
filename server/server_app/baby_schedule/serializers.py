from rest_framework import serializers
from .models import BabyScheduleModel


class BabyScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = BabyScheduleModel
        fields = "__all__"

        extra_kwargs = {
            "hardware_id": {"required": False},
            "title": {"required": False},
            "description": {"required": False},
            "time": {"required": False},
        }
