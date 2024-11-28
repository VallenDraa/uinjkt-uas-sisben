import useWebSocket from "react-use-websocket";
import { getEnv } from "~/config/env";

export const BABY_MONITORING_VIDEO_WS_URL =
  getEnv("WS_URL") + "/baby-monitoring/video";

export const useBabyMonitoringVideoWebSocket = () => {
  return useWebSocket(BABY_MONITORING_VIDEO_WS_URL);
};
