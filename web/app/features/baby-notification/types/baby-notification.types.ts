export type BabyNotificationTitle = "crying" | "discomfort";

export type BabyNotification = {
  id: string;
  title: BabyNotificationTitle;
  picture: string;
  clarification: string;
  created_at: string;
  updated_at: string;
  hardware_id: string;
};
