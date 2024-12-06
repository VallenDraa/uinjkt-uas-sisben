import * as React from "react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { CalendarIcon, Loader2Icon } from "lucide-react";
import { useBabySchedules } from "~/features/baby-schedule/hooks/use-baby-schedules";
import { prefetchGetBabySchedules } from "~/features/baby-schedule/queries/get-baby-schedules.query";
import { queryConfig } from "~/lib/react-query";
import { requirehardwareIdMiddleware } from "~/middlewares/require-hardware-id.middleware";
import {
  DateRange,
  DateRangePickerDialog,
} from "~/shared/components/elements/date-range-picker-dialog";
import {
  Timeline,
  TimelineDescription,
  TimelineHeader,
  TimelineItem,
  TimelineItemSkeleton,
  TimelineTime,
  TimelineTitle,
} from "~/shared/components/elements/timeline";
import { PageLayout } from "~/shared/components/layouts/page-layout";
import { Button } from "~/shared/components/ui/button";

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

  const [dateRange, setDateRange] = React.useState<DateRange>({
    from: new Date(),
    to: new Date(),
  });

  const {
    babySchedulesQuery,
    handleGenerateBabySchedules,
    generateBabySchedulesMutation,
  } = useBabySchedules({
    hardwareId,
    notificationFrom: dateRange.from.toISOString(),
    notificationTo: dateRange.to!.toISOString(),
    enableQuery: true,
  });

  const initialDate = new Date();

  return (
    <PageLayout title="Jadwal Bayi" backLink={{ name: "Kembali", href: "/" }}>
      <Timeline className="mb-10">
        {(babySchedulesQuery.isLoading || !babySchedulesQuery.data) && (
          <TimelineItemSkeleton
            amount={6}
            className="animate-in fade-in duration-300"
          />
        )}

        {!babySchedulesQuery.isLoading &&
          babySchedulesQuery.data?.map(data => {
            return data.schedules.map(schedule => (
              <TimelineItem
                key={schedule.id}
                className="animate-in fade-in duration-300"
              >
                <TimelineHeader>
                  <TimelineTime>
                    {new Date(schedule.time).toLocaleTimeString()}
                  </TimelineTime>
                  <TimelineTitle>{schedule.title}</TimelineTitle>
                </TimelineHeader>
                <TimelineDescription>
                  {schedule.description}
                </TimelineDescription>
              </TimelineItem>
            ));
          })}
      </Timeline>

      <DateRangePickerDialog
        showHeader
        disableUpdateButton={
          generateBabySchedulesMutation.isPending || !dateRange.to
        }
        range={dateRange}
        setRange={setDateRange}
        title="Buat Jadwal"
        description="Pilih jangka waktu notifikasi yang akan digunakan sebagai data untuk membuat jadwal baru."
        trigger={
          <Button
            disabled={generateBabySchedulesMutation.isPending}
            className="w-full"
          >
            {generateBabySchedulesMutation.isPending ? (
              <Loader2Icon className="size-4 animate-spin duration-1000" />
            ) : (
              <CalendarIcon className="size-4" />
            )}
            Buat Jadwal
          </Button>
        }
        cancelText="Batal"
        updateText="Buat Jadwal"
        initialDateFrom={initialDate}
        initialDateTo={initialDate}
        onUpdate={handleGenerateBabySchedules}
      />
    </PageLayout>
  );
};
