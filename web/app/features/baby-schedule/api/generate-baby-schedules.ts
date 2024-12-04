import { api } from "~/lib/axios";
import { BabySchedulesResponse } from "../types/baby-schedule.types";

export const generateBabySchedules = async (hardware_id: string) => {
  const { data } = await api.post<BabySchedulesResponse[]>(
    `/baby-schedules/generate/${hardware_id}`,
  );

  return data;
};
