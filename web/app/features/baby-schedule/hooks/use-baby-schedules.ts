import { useGenerateBabySchedules } from "../queries/generate-baby-schedules.query";
import { useGetBabySchedules } from "../queries/get-baby-schedules.query";

export type UseBabySchedules = {
  hardwareCode: string;
  enableQuery: boolean;
};

export const useBabySchedules = ({
  hardwareCode,
  enableQuery,
}: UseBabySchedules) => {
  const babySchedulesQuery = useGetBabySchedules({
    hardwareCode,
    queryConfig: { enabled: enableQuery },
  });

  const { mutateAsync: generateBabySchedules } = useGenerateBabySchedules({
    hardwareCode,
  });

  return {
    babySchedulesQuery,
    generateBabySchedules,
  };
};
