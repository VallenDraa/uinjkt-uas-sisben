import { QueryClient, queryOptions, useQuery } from "@tanstack/react-query";
import { QueryConfig } from "~/lib/react-query";
import { getBabySchedules } from "../api/get-baby-schedules.api";

export const GET_BABY_SCHEDULES_QUERY_KEY = "baby-schedules";

export const getBabySchedulesQueryOptions = (hardwareCode: string) => {
  return queryOptions({
    queryKey: [GET_BABY_SCHEDULES_QUERY_KEY],
    queryFn: () => getBabySchedules(hardwareCode),
  });
};

export type UseGetBabySchedulesOptions = {
  hardwareCode: string;
  queryConfig?: QueryConfig<typeof getBabySchedulesQueryOptions>;
};

export const useGetBabySchedules = ({
  hardwareCode,
  queryConfig,
}: UseGetBabySchedulesOptions) => {
  return useQuery({
    ...getBabySchedulesQueryOptions(hardwareCode),
    ...queryConfig,
  });
};

export const prefetchGetBabySchedules = async (
  queryClient: QueryClient,
  { hardwareCode, queryConfig }: UseGetBabySchedulesOptions,
) => {
  await queryClient.prefetchQuery({
    ...getBabySchedulesQueryOptions(hardwareCode),
    ...queryConfig,
  });

  return queryClient;
};
