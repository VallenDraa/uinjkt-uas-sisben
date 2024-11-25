from rest_framework import serializers
from .models import BabySchedule


class BabyScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = BabySchedule
        fields = "__all__"
