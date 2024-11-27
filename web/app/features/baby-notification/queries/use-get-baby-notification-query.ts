import { queryOptions, useQuery } from "@tanstack/react-query";
import { getBabyNotification } from "../api/get-baby-notification";
import { QueryConfig } from "~/lib/react-query";

export const GET_BABY_NOTIFICATIONS_QUERY_KEY = "baby-notification";

export const getBabyNotificationQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: [GET_BABY_NOTIFICATIONS_QUERY_KEY],
    queryFn: async () => {
      const data = await getBabyNotification(id);

      return data;
    },
  });
};

export type UseGetBabyNotificationOptions = {
  queryConfig?: QueryConfig<typeof getBabyNotificationQueryOptions>;
  id: string;
};

export const useGetBabyNotification = ({
  queryConfig,
  id,
}: UseGetBabyNotificationOptions) => {
  return useQuery({
    ...getBabyNotificationQueryOptions(id),
    ...queryConfig,
  });
};
