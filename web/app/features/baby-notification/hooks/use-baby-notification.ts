import { toast } from "sonner";
import { useGetBabyNotification } from "../queries/get-baby-notification.query";
import { useUpdateBabyNotification } from "../queries/update-baby-notification.query";
import { BabyNotification } from "../types/baby-notification.types";

export type UseBabyNotificationOptions = {
  id?: string;
  enableQuery: boolean;
};

export const useBabyNotification = ({
  id,
  enableQuery,
}: UseBabyNotificationOptions) => {
  const babyNotificationsQuery = useGetBabyNotification({
    id: id!,
    queryConfig: { enabled: enableQuery },
  });

  const { mutateAsync } = useUpdateBabyNotification();
  const handleUpdateBabyNotification = async (
    babyNotification: BabyNotification,
  ) => {
    try {
      await mutateAsync({ id: babyNotification.id, babyNotification });
      toast.success("Notifikasi berhasil diperbarui");
    } catch (error) {
      toast.error("Gagal memperbarui notifikasi");
    }
  };

  return {
    babyNotificationsQuery,
    handleUpdateBabyNotification,
  };
};
