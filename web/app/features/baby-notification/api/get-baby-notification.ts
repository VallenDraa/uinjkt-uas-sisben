import { api } from "~/lib/axios";
import { BabyNotification } from "../types/baby-notification.types";

export const getBabyNotification = async (id: string) => {
  const { data } = await api.get<BabyNotification>(
    `/baby-notifications/${id}/`,
  );

  return data;
};
