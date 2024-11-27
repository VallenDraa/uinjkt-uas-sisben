from django_filters import FilterSet

from .models import BabyNotificationModel


class BabyNotificationFilter(FilterSet):
    class Meta:
        model = BabyNotificationModel
        fields = {
            "created_at": ["range"],
        }
