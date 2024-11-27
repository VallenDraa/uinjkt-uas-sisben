from django_filters import FilterSet

from .models import MonitorHardwareModel


class MonitorHardwareFilter(FilterSet):
    class Meta:
        model = MonitorHardwareModel
        fields = {
            "created_at": ["range"],
        }
