import * as React from "react";
import { toast } from "sonner";
import { useGenerateBabySchedules } from "../queries/generate-baby-schedules.query";
import { useGetBabySchedules } from "../queries/get-baby-schedules.query";
import { isBabySchedulesEmpty } from "../utils/baby-schedule.utils";
import { useAlternatingText } from "~/shared/hooks/use-alternating-text";
import { isAxiosError } from "axios";

export type UseBabySchedules = {
  hardwareId: string;
  notificationFrom: string;
  notificationTo: string;
  enableQuery: boolean;
};

export const useBabySchedules = ({
  hardwareId,
  notificationFrom,
  notificationTo,
  enableQuery,
}: UseBabySchedules) => {
  const babySchedulesQuery = useGetBabySchedules({
    hardwareId,
    queryConfig: { enabled: enableQuery },
  });
  const isSchedulesEmpty = React.useMemo(() => {
    return isBabySchedulesEmpty(babySchedulesQuery.data ?? []);
  }, [babySchedulesQuery.data]);

  const {
    mutateAsync: generateBabySchedules,
    ...generateBabySchedulesMutation
  } = useGenerateBabySchedules({
    hardwareId,
    notificationFrom,
    notificationTo,
  });
  const handleGenerateBabySchedules = React.useCallback(async () => {
    try {
      const babySchedules = await generateBabySchedules({
        hardware_id: hardwareId,
        notification_from: notificationFrom,
        notification_to: notificationTo,
      });

      if (isBabySchedulesEmpty(babySchedules)) {
        toast.error(
          "Sepertinya dari range tanggal yang kamu pilih, tidak ada notifikasi untuk membuat jadwal ataupun semua klarifikasinya masih kosong",
        );
      } else {
        toast.success("Berhasil membuat jadwal bayi baru");
      }
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }

      toast.error("Gagal membuat jadwal bayi baru");
    }
  }, [generateBabySchedules, hardwareId, notificationFrom, notificationTo]);

  const loadingGeneratingText = useAlternatingText({
    interval: 4000,
    textList: [
      "Menyesuaikan jadwal bayi anda ...",
      "Mengoptimalkan jadwal bayi ...",
      "Lagi otw buat jadwal nih ...",
      "Sabar yaa, bentar lagi ...",
      "Ga sabaran banget, bentar lagi et dah ...",
    ],
    isActive: generateBabySchedulesMutation.isPending,
  });

  return {
    babySchedulesQuery,
    isSchedulesEmpty,
    handleGenerateBabySchedules,
    generateBabySchedulesMutation,
    loadingGeneratingText,
  };
};
