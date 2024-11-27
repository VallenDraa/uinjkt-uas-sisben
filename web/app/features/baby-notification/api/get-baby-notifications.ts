import { api } from "~/lib/axios";
import {
  PaginatedApiResponse,
  FilterParameters,
} from "~/shared/models/api.types";
import { BabyNotification } from "../types/baby-notification.types";

export const getBabyNotifications = async (params?: FilterParameters) => {
  const { data } = await api.get<PaginatedApiResponse<BabyNotification[]>>(
    `/baby-notifications`,
    { params },
  );

  return data;
};
