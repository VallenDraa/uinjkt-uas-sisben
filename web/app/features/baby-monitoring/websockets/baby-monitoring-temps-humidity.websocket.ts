import * as React from "react";
import useWebSocket from "react-use-websocket";
import { getEnv } from "~/config/env";
import {
  BabyMonitoringNotification,
  BabyMonitoringTempsHumidity,
} from "../types/baby-monitoring.types";
import { WEBSOCKET_CONFIG } from "~/lib/websocket";
import { toastNotification } from "~/shared/utils/notifications";

export const BABY_MONITORING_TEMPS_HUMIDITY_WS_URL =
  getEnv("WS_URL") + "/baby-monitoring/temps-humidity";

export const useBabyMonitoringTempsHumidityWebSocket = (hardwareId: string) => {
  const socket = useWebSocket<
    BabyMonitoringTempsHumidity | BabyMonitoringNotification | null
  >(
    `${BABY_MONITORING_TEMPS_HUMIDITY_WS_URL}/${hardwareId}/`,
    WEBSOCKET_CONFIG,
  );

  React.useEffect(() => {
    if (
      socket.lastJsonMessage &&
      "message" in socket.lastJsonMessage &&
      socket.lastJsonMessage.message
    ) {
      toastNotification("warning", socket.lastJsonMessage.message, {
        duration: 3000,
      });
    }
  }, [socket.lastJsonMessage]);

  const tempsHumidity = React.useMemo(() => {
    if (!socket.lastJsonMessage) {
      return null;
    }

    if (
      "temp_celcius" in socket.lastJsonMessage &&
      "temp_farenheit" in socket.lastJsonMessage &&
      "humidity" in socket.lastJsonMessage
    ) {
      return socket.lastJsonMessage;
    }

    return null;
  }, [socket.lastJsonMessage]);

  return { ...socket, tempsHumidity };
};
