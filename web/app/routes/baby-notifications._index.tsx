// TODO: Fix ssr not rendering the list items
import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import * as React from "react";
import { BabyNotificationsListItem } from "~/features/baby-notification/components/elements/baby-notifications-list/baby-notifications-list-item";
import {
  prefetchGetBabyNotifications,
  useGetBabyNotifications,
} from "~/features/baby-notification/queries/get-baby-notifications-query";
import { queryConfig } from "~/lib/react-query";
import { DataFilters } from "~/shared/components/elements/data-filters";

import { VirtualList } from "~/shared/components/elements/virtual-list";
import { PageLayout } from "~/shared/components/layouts/page-layout";
import { DEFAULT_DATA_FILTERS } from "~/shared/constants/data-filters.constants";
import { useDataFilters } from "~/shared/hooks/use-data-filters";
import { useIsClient } from "~/shared/hooks/use-is-client";
import { useMediaQuery } from "~/shared/hooks/use-media-query";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const queryClient = new QueryClient({ defaultOptions: queryConfig });

  const prefetchedQuery = await prefetchGetBabyNotifications(queryClient);

  return {
    dehydratedState: dehydrate(prefetchedQuery),
  };
};

export default function BabyNotificationsPageWrapper() {
  const { dehydratedState } = useLoaderData<typeof loader>();

  return (
    <HydrationBoundary state={dehydratedState}>
      <BabyNotificationsPage />
    </HydrationBoundary>
  );
}

const BabyNotificationsPage = () => {
  const { filters, setFilters } = useDataFilters({
    useQueryParams: true,
    defaultValues: DEFAULT_DATA_FILTERS,
  });

  const babyNotificationsQuery = useGetBabyNotifications({
    filterParameters: filters,
  });
  const flatItems = React.useMemo(
    () => ({
      count: babyNotificationsQuery.data?.pages.at(-1)?.count ?? 0,
      items:
        babyNotificationsQuery.data?.pages.flatMap(item => item.results) ?? [],
    }),
    [babyNotificationsQuery.data],
  );

  const handleFetchNextPage = React.useCallback(
    (isIntersecting: boolean) => {
      if (isIntersecting && babyNotificationsQuery.hasNextPage) {
        babyNotificationsQuery.fetchNextPage();
      }
    },
    [babyNotificationsQuery.hasNextPage, babyNotificationsQuery.fetchNextPage],
  );

  const isClient = useIsClient();
  const isSmallScreen = useMediaQuery("(max-width: 640px)");

  return (
    <PageLayout
      title="Notifikasi Bayi"
      backLink={{ name: "Kembali", href: "/" }}
      classNames={{ main: "grow flex flex-col" }}
    >
      <DataFilters
        classNames={{ wrapper: "mb-6" }}
        filters={filters}
        setFilters={setFilters}
      />

      {isClient && (
        <VirtualList
          items={flatItems.items || []}
          classNames={{ wrapper: "grow", item: "flex" }}
          intersectionObserverOptions={{ onChange: handleFetchNextPage }}
          virtualOptions={{
            count: babyNotificationsQuery.hasNextPage
              ? flatItems.count + 1
              : flatItems.count,
            defaultItemSize: isSmallScreen ? 276 : 240,
          }}
        >
          {({ item }) => {
            return item ? <BabyNotificationsListItem item={item} /> : null;
          }}
        </VirtualList>
      )}
    </PageLayout>
  );
};
