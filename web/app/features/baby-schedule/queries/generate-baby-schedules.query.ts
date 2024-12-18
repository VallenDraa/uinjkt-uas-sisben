import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MutationConfig } from "~/lib/react-query";
import { generateBabySchedules } from "../api/generate-baby-schedules.api";
import { getBabySchedulesQueryOptions } from "./get-baby-schedules.query";

type UseGenerateBabySchedulesOptions = {
  hardwareId: string;
  notificationFrom: string;
  notificationTo: string;
  mutationConfig?: MutationConfig<typeof generateBabySchedules>;
};

export const useGenerateBabySchedules = ({
  hardwareId,
  notificationFrom,
  notificationTo,
  mutationConfig,
}: UseGenerateBabySchedulesOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...mutationConfig,
    mutationFn: () =>
      generateBabySchedules({
        hardware_id: hardwareId,
        notification_from: notificationFrom,
        notification_to: notificationTo,
      }),
    onSuccess: data => {
      queryClient.setQueryData(
        getBabySchedulesQueryOptions(hardwareId).queryKey,
        () => data.values,
      );
    },
  });
};
