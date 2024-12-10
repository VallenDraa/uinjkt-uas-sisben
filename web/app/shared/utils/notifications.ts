import { toast } from "sonner";

export const requestPermission = async () => {
  if (!("Notification" in window)) {
    return;
  }

  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    toast.info(
      "Nyalakan notifikasi untuk mendapatkan informasi monitoring secara live.",
    );
  }
};
