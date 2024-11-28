import { Options as WebsocketOptions } from "react-use-websocket";

export const WEBSOCKET_CONFIG: WebsocketOptions = {
  shouldReconnect: () => true,
  reconnectAttempts: 5,
  reconnectInterval: 1500,
};
