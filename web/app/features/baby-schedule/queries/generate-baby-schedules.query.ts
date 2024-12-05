import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MutationConfig } from "~/lib/react-query";
import { generateBabySchedules } from "../api/generate-baby-schedules.api";
import { getBabySchedulesQueryOptions } from "./get-baby-schedules.query";

type UseGenerateBabySchedulesOptions = {
  hardwareId: string;
  mutationConfig?: MutationConfig<typeof generateBabySchedules>;
};

export const useGenerateBabySchedules = ({
  hardwareId,
  mutationConfig,
}: UseGenerateBabySchedulesOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...mutationConfig,
    mutationFn: () => generateBabySchedules(hardwareId),
    onSuccess: data => {
      queryClient.setQueryData(
        getBabySchedulesQueryOptions(hardwareId).queryKey,
        () => data,
      );
    },
  });
};
