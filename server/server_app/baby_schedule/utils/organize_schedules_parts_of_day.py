from datetime import time

from baby_schedule.models import BabyScheduleModel
from baby_schedule.constants import PARTS_OF_DAY


def get_part_of_day(current_time: time) -> str | None:
    for part in PARTS_OF_DAY:
        start, end = part["range"]

        # Handle range that wraps around midnight
        if start <= end:
            if start <= current_time <= end:
                return part["name"]
        else:  # Overnight range (e.g., 21:00-04:59)
            if current_time >= start or current_time <= end:
                return part["name"]

    return None  # Fallback if no range matches


def organize_schedules_parts_of_day(
    schedules: list[BabyScheduleModel],
):
    result = list(
        map(
            lambda part_of_day: {
                "part_of_day": part_of_day["name"],
                "schedules": [],
            },
            PARTS_OF_DAY,
        )
    )

    for schedule in schedules:
        part_of_day = get_part_of_day(schedule.time.time())

        if part_of_day:
            for item in result:
                if item["part_of_day"] == part_of_day:
                    item["schedules"].append(schedule)
                    break

    return result
