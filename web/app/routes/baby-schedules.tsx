// TODO: Handle saving and getting hardware id from session
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
import { requirehardwareCodeMiddleware } from "~/middlewares/require-hardware-code.middleware";
import { PageLayout } from "~/shared/components/layouts/page-layout";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requirehardwareCodeMiddleware(request);

  const queryClient = new QueryClient({ defaultOptions: queryConfig });

  const prefetchedQuery = await prefetchGetBabySchedules(queryClient, {
    hardwareCode: "",
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
  useBabySchedules({ hardwareCode: "", enableQuery: true });

  return (
    <PageLayout title="Jadwal Bayi" backLink={{ name: "Kembali", href: "/" }}>
      Jadwal
    </PageLayout>
  );
};
