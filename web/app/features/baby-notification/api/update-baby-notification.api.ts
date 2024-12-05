import { api } from "~/lib/axios";
import { BabyNotification } from "../types/baby-notification.types";

export const updateBabyNotification = async ({
  id,
  babyNotification,
}: {
  id: string;
  babyNotification: BabyNotification;
}) => {
  const { clarification, humidity, temp_celcius, temp_farenheit, title } =
    babyNotification;

  const { data } = await api.put<BabyNotification>(
    `/baby-notifications/${id}/`,
    { clarification, humidity, temp_celcius, temp_farenheit, title },
  );

  return data;
};
