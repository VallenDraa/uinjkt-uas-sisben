from rest_framework import serializers
from .models import BabyNotificationModel


class BabyNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = BabyNotificationModel
        fields = "__all__"
