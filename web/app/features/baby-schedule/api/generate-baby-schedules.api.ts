import { api } from "~/lib/axios";
import { BabySchedulesResponse } from "../types/baby-schedule.types";

export const generateBabySchedules = async ({
  hardware_id,
  notification_from,
  notification_to,
}: {
  hardware_id: string;
  notification_from: string;
  notification_to: string;
}) => {
  const { data } = await api.post<BabySchedulesResponse[]>(
    `/baby-schedules/${hardware_id}/`,
    {
      notification_from,
      notification_to,
    },
  );

  return data;
};
