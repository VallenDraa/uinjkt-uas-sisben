import * as React from "react";
import { toast } from "sonner";
import { useGenerateBabySchedules } from "../queries/generate-baby-schedules.query";
import { useGetBabySchedules } from "../queries/get-baby-schedules.query";

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
      await generateBabySchedules({
        hardware_id: hardwareId,
        notification_from: notificationFrom,
        notification_to: notificationTo,
      });
      toast.success("Berhasil membuat jadwal bayi baru");
    } catch (error) {
      toast.error("Gagal membuat jadwal bayi");
    }
  }, [generateBabySchedules, hardwareId, notificationFrom, notificationTo]);

  return {
    babySchedulesQuery,
    handleGenerateBabySchedules,
    generateBabySchedulesMutation,
  };
};
