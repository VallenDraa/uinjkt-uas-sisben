import useWebSocket from "react-use-websocket";
import { getEnv } from "~/config/env";
import { BabyMonitoringTempsHumidity } from "../types/baby-monitoring.types";

export const BABY_MONITORING_TEMPS_HUMIDITY_WS_URL =
  getEnv("WS_URL") + "/baby-monitoring/temps-humidity";

export const useBabyMonitoringTempsHumidityWebSocket = () => {
  return useWebSocket<BabyMonitoringTempsHumidity>(
    BABY_MONITORING_TEMPS_HUMIDITY_WS_URL,
  );
};
