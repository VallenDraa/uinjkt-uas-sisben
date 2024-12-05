import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { useBabySchedules } from "~/features/baby-schedule/hooks/use-baby-schedules";
import { prefetchGetBabySchedules } from "~/features/baby-schedule/queries/get-baby-schedules.query";
import { queryConfig } from "~/lib/react-query";
import { requirehardwareIdMiddleware } from "~/middlewares/require-hardware-id.middleware";
import { PageLayout } from "~/shared/components/layouts/page-layout";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { hardwareId } = await requirehardwareIdMiddleware(request);

  const queryClient = new QueryClient({ defaultOptions: queryConfig });
  const prefetchedQuery = await prefetchGetBabySchedules(queryClient, {
    hardwareId,
  });

  return {
    hardwareId,
    dehydratedState: dehydrate(prefetchedQuery),
  };
};

export default function BabySchedulePageWrapper() {
  const { dehydratedState } = useLoaderData<typeof loader>();

  return (
    <HydrationBoundary state={dehydratedState}>
      <BabySchedulePage />
    </HydrationBoundary>
  );
}

const BabySchedulePage = () => {
  const { hardwareId } = useLoaderData<typeof loader>();
  useBabySchedules({ hardwareId, enableQuery: true });

  return (
    <PageLayout title="Jadwal Bayi" backLink={{ name: "Kembali", href: "/" }}>
      Jadwal
    </PageLayout>
  );
};
