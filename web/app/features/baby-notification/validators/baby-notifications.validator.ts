import { z } from "zod";
import { BabyNotification } from "../types/baby-notification.types";

export const babyNotificationsValidator: z.Schema<BabyNotification> = z.object({
  id: z.string(),
  title: z.string(),
  picture: z.string(),
  clarification: z.string(),
  temp_celcius: z.number(),
  temp_farenheit: z.number(),
  humidity: z.number().min(0, "Kelembapan tidak boleh kurang dari 0%"),
  created_at: z.string(),
  updated_at: z.string(),
  hardware_id: z.string(),
});
