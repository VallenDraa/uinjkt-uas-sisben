from rest_framework import serializers
from .models import BabyNotificationModel


class BabyNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = BabyNotificationModel
        fields = "__all__"

        extra_kwargs = {
            "hardware_id": {"required": False},
            "title": {"required": False},
            "picture": {"required": False},
            "temp_celcius": {"required": False},
            "temp_farenheit": {"required": False},
            "humidity": {"required": False},
            "clarification": {"required": False},
        }
