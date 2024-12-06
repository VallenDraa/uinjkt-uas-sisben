import { BabySchedulesResponse } from "../types/baby-schedule.types";

export const isBabySchedulesEmpty = (
  babySchedules: BabySchedulesResponse[],
) => {
  return (
    babySchedules.length === 0 ||
    babySchedules.every(babySchedule => babySchedule.schedules.length === 0)
  );
};
