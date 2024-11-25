from rest_framework import serializers
from .models import BabyNotification


class BabyNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = BabyNotification
        fields = "__all__"
