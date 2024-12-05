import {
  infiniteQueryOptions,
  QueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import {
  FilterParameters,
  PaginatedApiResponse,
} from "~/shared/types/api.types";
import { getBabyNotifications } from "../api/get-baby-notifications.api";
import { QueryConfig } from "~/lib/react-query";
import { BabyNotification } from "../types/baby-notification.types";

export const GET_BABY_NOTIFICATIONS_QUERY_KEY = "baby-notifications";

export const getBabyNotificationsQueryOptions = (
  filterParameters?: FilterParameters,
) => {
  return infiniteQueryOptions({
    initialPageParam: 1,
    getNextPageParam: (
      lastPage: PaginatedApiResponse<BabyNotification[]>,
      _a,
      lastPageParam,
    ) => {
      const { next } = lastPage;

      const nextPageParam = next !== null ? lastPageParam + 1 : undefined;

      return nextPageParam;
    },
    queryKey: [GET_BABY_NOTIFICATIONS_QUERY_KEY, filterParameters],
    queryFn: async ctx => {
      const data = await getBabyNotifications({
        ...filterParameters,
        page: ctx.pageParam.toString(),
      });

      return data;
    },
  });
};

export type UseGetBabyNotificationsOptions = {
  queryConfig?: QueryConfig<typeof getBabyNotificationsQueryOptions>;
  filterParameters?: FilterParameters;
};

export const useGetBabyNotifications = ({
  queryConfig,
  filterParameters,
}: UseGetBabyNotificationsOptions = {}) => {
  return useInfiniteQuery({
    ...getBabyNotificationsQueryOptions(filterParameters),
    ...queryConfig,
  });
};

export const prefetchGetBabyNotifications = async (
  queryClient: QueryClient,
  { filterParameters, queryConfig }: UseGetBabyNotificationsOptions = {},
) => {
  await queryClient.prefetchInfiniteQuery({
    ...getBabyNotificationsQueryOptions(filterParameters),
    ...queryConfig,
  });

  return queryClient;
};
