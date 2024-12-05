import { useGenerateBabySchedules } from "../queries/generate-baby-schedules.query";
import { useGetBabySchedules } from "../queries/get-baby-schedules.query";

export type UseBabySchedules = {
  hardwareId: string;
  enableQuery: boolean;
};

export const useBabySchedules = ({
  hardwareId,
  enableQuery,
}: UseBabySchedules) => {
  const babySchedulesQuery = useGetBabySchedules({
    hardwareId,
    queryConfig: { enabled: enableQuery },
  });

  const { mutateAsync: generateBabySchedules } = useGenerateBabySchedules({
    hardwareId,
  });

  return {
    babySchedulesQuery,
    generateBabySchedules,
  };
};
