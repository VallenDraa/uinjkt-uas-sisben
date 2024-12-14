import * as React from "react";
import {
  isNotificationSupported,
  requestNotificationPermission,
} from "../utils/notifications";
import { toast } from "sonner";

import { useIsClient } from "./use-is-client";

export const useNotifications = () => {
  const isClient = useIsClient();
  const [isPermitted, setIsPermitted] = React.useState(() => {
    if (!isClient || !isNotificationSupported()) {
      return false;
    }

    return Notification.permission === "granted";
  });
  const [error, setError] = React.useState<Error | null>(null);

  const isPermissionAskedRef = React.useRef(false);
  React.useEffect(() => {
    if (
      isPermitted ||
      !isPermissionAskedRef.current ||
      !isNotificationSupported()
    ) {
      return;
    }

    isPermissionAskedRef.current = true;
    requestNotificationPermission()
      .then(permission => {
        if (permission !== "granted") {
          toast.info(
            "Nyalakan notifikasi untuk mendapatkan informasi monitoring secara live.",
          );
        }

        setIsPermitted(permission === "granted");
      })
      .catch(setError);
  }, [isPermitted]);

  const resetError = React.useCallback(() => setError(null), []);

  const sendNotification = React.useCallback(() => {}, []);

  return { isPermitted, error, resetError };
};
