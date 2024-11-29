import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import {
  getBabyNotificationQueryOptions,
  prefetchGetBabyNotification,
} from "~/features/baby-notification/queries/get-baby-notification-query";
import { queryConfig } from "~/lib/react-query";
import { PageLayout } from "~/shared/components/layouts/page-layout";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;

  if (!id) {
    throw new Response(null, {
      status: 404,
      statusText: "Notifikasi Bayi tidak ditemukan!",
    });
  }

  const queryClient = new QueryClient({ defaultOptions: queryConfig });

  const prefetchedQuery = await prefetchGetBabyNotification(queryClient, {
    id,
  });

  const data = prefetchedQuery.getQueryData(
    getBabyNotificationQueryOptions(id).queryKey,
  );

  if (!data) {
    throw new Response(null, {
      status: 404,
      statusText: "Notifikasi Bayi tidak ditemukan!",
    });
  }

  return {
    dehydratedState: dehydrate(prefetchedQuery),
  };
};

export default function BabyNotificationsPageWrapper() {
  const { dehydratedState } = useLoaderData<typeof loader>();

  return (
    <HydrationBoundary state={dehydratedState}>
      <SingleBabyNotificationPage />
    </HydrationBoundary>
  );
}

const SingleBabyNotificationPage = () => {
  return (
    <PageLayout
      title="Notifikasi Bayi 123"
      backLink={{ name: "Kembali", href: "/baby-notifications" }}
    >
      Notifikasi 12323
    </PageLayout>
  );
};
