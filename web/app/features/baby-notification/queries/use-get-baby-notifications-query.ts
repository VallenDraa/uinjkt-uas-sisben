import { QueryClient, queryOptions, useQuery } from "@tanstack/react-query";
import { FilterParameters } from "~/shared/models/api.types";
import { getBabyNotifications } from "../api/get-baby-notifications";
import { QueryConfig } from "~/lib/react-query";

export const GET_BABY_NOTIFICATIONS_QUERY_KEY = "baby-notifications";

export const getBabyNotificationsQueryOptions = (
  FilterParameters?: FilterParameters,
) => {
  return queryOptions({
    queryKey: [GET_BABY_NOTIFICATIONS_QUERY_KEY, FilterParameters],
    queryFn: async () => {
      const data = await getBabyNotifications(FilterParameters);

      return data;
    },
  });
};

export type UseGetBabyNotificationsOptions = {
  queryConfig?: QueryConfig<typeof getBabyNotificationsQueryOptions>;
  FilterParameters?: FilterParameters;
};

export const useGetBabyNotifications = ({
  queryConfig,
  FilterParameters,
}: UseGetBabyNotificationsOptions = {}) => {
  return useQuery({
    ...getBabyNotificationsQueryOptions(FilterParameters),
    ...queryConfig,
  });
};

export const prefetchGetBabyNotifications = async (
  queryClient: QueryClient,
  { FilterParameters, queryConfig }: UseGetBabyNotificationsOptions = {},
) => {
  await queryClient.prefetchQuery({
    ...getBabyNotificationsQueryOptions(FilterParameters),
    ...queryConfig,
  });

  return queryClient;
};
