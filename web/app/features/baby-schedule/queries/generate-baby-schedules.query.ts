import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MutationConfig } from "~/lib/react-query";
import { generateBabySchedules } from "../api/generate-baby-schedules.api";
import { getBabySchedulesQueryOptions } from "./get-baby-schedules.query";

type UseGenerateBabySchedulesOptions = {
  hardwareCode: string;
  mutationConfig?: MutationConfig<typeof generateBabySchedules>;
};

export const useGenerateBabySchedules = ({
  hardwareCode,
  mutationConfig,
}: UseGenerateBabySchedulesOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...mutationConfig,
    mutationFn: () => generateBabySchedules(hardwareCode),
    onSuccess: data => {
      queryClient.setQueryData(
        getBabySchedulesQueryOptions(hardwareCode).queryKey,
        () => data,
      );
    },
  });
};
