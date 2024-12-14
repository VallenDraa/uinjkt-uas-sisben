import useWebSocket from "react-use-websocket";
import { getEnv } from "~/config/env";
import { BabyMonitoringNotification } from "../types/baby-monitoring.types";
import { WEBSOCKET_CONFIG } from "~/lib/websocket";
import React from "react";
import { toastNotification } from "~/shared/utils/notifications";

export const BABY_MONITORING_VIDEO_WS_URL =
  getEnv("WS_URL") + "/baby-monitoring/video";

export const useBabyMonitoringVideoWebSocket = (hardwareId: string) => {
  const socket = useWebSocket<BabyMonitoringNotification | null>(
    `${BABY_MONITORING_VIDEO_WS_URL}/${hardwareId}/`,
    WEBSOCKET_CONFIG,
  );

  React.useEffect(() => {
    if (socket.lastJsonMessage?.message) {
      toastNotification("warning", socket.lastJsonMessage.message, {
        duration: 3000,
      });
    }
  }, [socket.lastJsonMessage]);

  return socket;
};
