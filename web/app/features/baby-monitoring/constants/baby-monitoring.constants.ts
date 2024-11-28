import { getEnv } from "~/config/env";

export const BABY_MONITORING_VIDEO_STREAM_URL =
  getEnv("API_URL") + "/baby-streaming/video";
