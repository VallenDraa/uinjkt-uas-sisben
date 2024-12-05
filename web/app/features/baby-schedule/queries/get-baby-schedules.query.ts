import { QueryClient, queryOptions, useQuery } from "@tanstack/react-query";
import { QueryConfig } from "~/lib/react-query";
import { getBabySchedules } from "../api/get-baby-schedules.api";

export const GET_BABY_SCHEDULES_QUERY_KEY = "baby-schedules";

export const getBabySchedulesQueryOptions = (hardwareId: string) => {
  return queryOptions({
    queryKey: [GET_BABY_SCHEDULES_QUERY_KEY],
    queryFn: () => getBabySchedules(hardwareId),
  });
};

export type UseGetBabySchedulesOptions = {
  hardwareId: string;
  queryConfig?: QueryConfig<typeof getBabySchedulesQueryOptions>;
};

export const useGetBabySchedules = ({
  hardwareId,
  queryConfig,
}: UseGetBabySchedulesOptions) => {
  return useQuery({
    ...getBabySchedulesQueryOptions(hardwareId),
    ...queryConfig,
  });
};

export const prefetchGetBabySchedules = async (
  queryClient: QueryClient,
  { hardwareId, queryConfig }: UseGetBabySchedulesOptions,
) => {
  await queryClient.prefetchQuery({
    ...getBabySchedulesQueryOptions(hardwareId),
    ...queryConfig,
  });

  return queryClient;
};
