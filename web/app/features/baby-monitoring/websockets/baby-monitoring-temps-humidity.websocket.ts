import useWebSocket from "react-use-websocket";
import { getEnv } from "~/config/env";
import { BabyMonitoringTempsHumidity } from "../types/baby-monitoring.types";
import { WEBSOCKET_CONFIG } from "~/lib/websocket";

export const BABY_MONITORING_TEMPS_HUMIDITY_WS_URL =
  getEnv("WS_URL") + "/baby-monitoring/temps-humidity";

export const useBabyMonitoringTempsHumidityWebSocket = (hardwareId: string) => {
  const socket = useWebSocket<BabyMonitoringTempsHumidity | null>(
    `${BABY_MONITORING_TEMPS_HUMIDITY_WS_URL}/${hardwareId}/`,
    WEBSOCKET_CONFIG,
  );

  return socket;
};
