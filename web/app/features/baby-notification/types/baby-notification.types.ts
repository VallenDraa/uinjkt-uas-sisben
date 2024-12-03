import { z } from "zod";
import { type babyNotificationTitleEnums } from "../validators/baby-notifications.validator";

export type BabyNotificationTitle = z.infer<typeof babyNotificationTitleEnums>;

export type BabyNotification = {
  id: string;
  title: BabyNotificationTitle;
  picture: string;
  clarification: string;
  temp_celcius: number;
  temp_farenheit: number;
  humidity: number;
  created_at: string;
  updated_at: string;
  hardware_id: string;
};
