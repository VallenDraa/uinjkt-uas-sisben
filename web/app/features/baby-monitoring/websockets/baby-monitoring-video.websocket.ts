import useWebSocket from "react-use-websocket";
import { getEnv } from "~/config/env";
import { WEBSOCKET_CONFIG } from "~/lib/websocket";

export const BABY_MONITORING_VIDEO_WS_URL =
  getEnv("WS_URL") + "/baby-monitoring/video";

export const useBabyMonitoringVideoWebSocket = (hardwareId: string) => {
  const socket = useWebSocket(
    `${BABY_MONITORING_VIDEO_WS_URL}/${hardwareId}/`,
    WEBSOCKET_CONFIG,
  );

  return socket;
};
