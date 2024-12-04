import { api } from "~/lib/axios";
import { BabySchedulesResponse } from "../types/baby-schedule.types";

export const getBabySchedules = async (hardware_id: string) => {
  const { data } = await api.get<BabySchedulesResponse[]>(
    `/baby-schedules/${hardware_id}`,
  );

  return data;
};
