import * as React from "react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useBeforeUnload, useBlocker, useLoaderData } from "@remix-run/react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import {
  CalendarIcon,
  Loader2Icon,
  PackageOpenIcon,
  ZapIcon,
} from "lucide-react";
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
import { TitleIconAlert } from "~/shared/components/sections/title-icon-alert";

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
    isSchedulesEmpty,
    handleGenerateBabySchedules,
    generateBabySchedulesMutation,
    loadingGeneratingText,
  } = useBabySchedules({
    hardwareId,
    notificationFrom: `${
      new Date(dateRange.from.getTime() + 1000 * 60 * 60 * 24)
        .toISOString()
        .split("T")[0]
    }T00:00:00`,
    notificationTo: `${
      new Date((dateRange.to ?? new Date()).getTime() + 1000 * 60 * 60 * 24)
        .toISOString()
        .split("T")[0]
    }T23:59:59`,
    enableQuery: true,
  });

  // Prevent user from leaving the page while generating baby schedules
  useBeforeUnload(
    React.useCallback(
      e => {
        if (generateBabySchedulesMutation.isPending) {
          e.preventDefault();
          e.returnValue = "";
        }
      },
      [generateBabySchedulesMutation.isPending],
    ),
  );
  useBlocker(generateBabySchedulesMutation.isPending);

  return (
    <PageLayout
      title="Jadwal Bayi"
      backLink={{
        name: "Kembali",
        href: "/",
        disabled: generateBabySchedulesMutation.isPending,
      }}
      classNames={{ main: "flex md:block flex-col" }}
    >
      <Timeline className="mb-10 grow flex flex-col justify-center">
        {generateBabySchedulesMutation.isPending && (
          <TitleIconAlert
            classNames={{
              icon: "animate-bounce duration-[4000ms] ease-in-out",
            }}
            icon={ZapIcon}
            description={loadingGeneratingText}
          />
        )}
        {!generateBabySchedulesMutation.isPending &&
          (babySchedulesQuery.isLoading || !babySchedulesQuery.data) && (
            <TimelineItemSkeleton
              amount={6}
              className="animate-in fade-in duration-300"
            />
          )}
        {!generateBabySchedulesMutation.isPending &&
          !babySchedulesQuery.isLoading && (
            <>
              {isSchedulesEmpty && (
                <TitleIconAlert
                  icon={PackageOpenIcon}
                  description="Belum ada jadwal yang dibuat. Silahkan buat jadwal baru!"
                />
              )}

              {babySchedulesQuery.data?.map(data => {
                return data.schedules
                  .toSorted(
                    (a, b) =>
                      new Date(a.time).getTime() - new Date(b.time).getTime(),
                  )
                  .map(schedule => (
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
            </>
          )}
      </Timeline>

      <DateRangePickerDialog
        calendarProps={{
          disabled: { after: new Date() },
        }}
        showHeader
        disableUpdateButton={generateBabySchedulesMutation.isPending}
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
        initialDateFrom={dateRange.from}
        initialDateTo={dateRange.to}
        onUpdate={handleGenerateBabySchedules}
      />
    </PageLayout>
  );
};
