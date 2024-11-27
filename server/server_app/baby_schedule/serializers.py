from rest_framework import serializers
from .models import BabyScheduleModel


class BabyScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = BabyScheduleModel
        fields = "__all__"
