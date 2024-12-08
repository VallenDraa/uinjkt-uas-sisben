import { getEnv } from "~/config/env";

export const getVideoStreamUrl = (hardwareId: string) => {
  return `${getEnv("API_URL")}/baby-monitoring/video/${hardwareId}/`;
};
