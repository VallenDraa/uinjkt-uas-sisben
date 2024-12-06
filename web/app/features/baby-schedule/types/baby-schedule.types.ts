export type BabySchedule = {
  id: string;
  hardware_id: string;
  title: string;
  description: string;
  time: string;
  created_at: string;
  updated_at: string;
};

export type PartsOfDay = "morning" | "afternoon" | "evening" | "night";
export type BabySchedulesResponse = {
  parts_of_day: PartsOfDay;
  schedules: BabySchedule[];
};
