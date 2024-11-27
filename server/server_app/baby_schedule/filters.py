from django_filters import FilterSet

from .models import BabyScheduleModel


class BabyScheduleFilter(FilterSet):
    class Meta:
        model = BabyScheduleModel
        fields = {
            "created_at": ["range"],
        }
