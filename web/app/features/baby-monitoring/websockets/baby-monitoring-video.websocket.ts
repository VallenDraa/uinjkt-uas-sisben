import * as React from "react";
import useWebSocket from "react-use-websocket";
import { getEnv } from "~/config/env";
import { WEBSOCKET_CONFIG } from "~/lib/websocket";
import { changeBlobToImage } from "~/shared/utils/image";

export const BABY_MONITORING_VIDEO_WS_URL =
  getEnv("WS_URL") + "/baby-monitoring/video";

export const useBabyMonitoringVideoWebSocket = (hardwareId: string) => {
  const socket = useWebSocket(
    `${BABY_MONITORING_VIDEO_WS_URL}/${hardwareId}/`,
    WEBSOCKET_CONFIG,
  );

  const imageFrameUrlRef = React.useRef<string | null>(null);
  React.useEffect(() => {
    if (socket.lastMessage?.data) {
      const imageBlob = socket.lastMessage?.data;

      const { url, cleanup } = changeBlobToImage(imageBlob);

      imageFrameUrlRef.current = url;

      return cleanup;
    }
  }, [socket.lastMessage?.data]);

  return { ...socket, imageFrameUrlRef };
};
