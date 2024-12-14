import { ExternalToast, toast } from "sonner";

export const isNotificationSupported = () => {
  return "Notification" in window;
};

export const requestNotificationPermission = async () => {
  const permission = await Notification.requestPermission();

  return permission;
};

export const toastNotification = async (
  type: "success" | "error" | "warning" | "info",
  message: React.ReactNode,
  options?: ExternalToast,
) => {
  toast[type](message, options);
  const audio = new Audio("/pop-notification.wav");
  audio.volume = 0.5;
  audio.play();
};
