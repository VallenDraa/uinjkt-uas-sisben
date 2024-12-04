// TODO: Handle saving and getting hardware id from session
import { useLoaderData } from "@remix-run/react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { useBabySchedules } from "~/features/baby-schedule/hooks/use-baby-schedules";
import { prefetchGetBabySchedules } from "~/features/baby-schedule/queries/get-baby-schedules.query";
import { queryConfig } from "~/lib/react-query";
import { PageLayout } from "~/shared/components/layouts/page-layout";

export const loader = async () => {
  const queryClient = new QueryClient({ defaultOptions: queryConfig });

  const prefetchedQuery = await prefetchGetBabySchedules(queryClient, {
    hardwareId: "",
  });

  return {
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
  useBabySchedules({ hardwareId: "", enableQuery: true });

  return (
    <PageLayout title="Jadwal Bayi" backLink={{ name: "Kembali", href: "/" }}>
      Jadwal
    </PageLayout>
  );
};
