import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import {
  DropletsIcon,
  InfoIcon,
  SaveIcon,
  ThermometerSunIcon,
} from "lucide-react";
import {
  getBabyNotificationQueryOptions,
  prefetchGetBabyNotification,
} from "~/features/baby-notification/queries/get-baby-notification.query";
import { queryConfig } from "~/lib/react-query";
import { NumberStatsWithIcon } from "~/features/baby-monitoring/components/elements/number-stats-with-icon";
import { PageLayout } from "~/shared/components/layouts/page-layout";
import { Image } from "~/shared/components/ui/image";
import { Separator } from "~/shared/components/ui/separator";
import { formatDateYYYYMMDD } from "~/shared/utils/formatter";
import { useMediaQuery } from "~/shared/hooks/use-media-query";
import { Textarea } from "~/shared/components/ui/textarea";
import { useForm } from "react-hook-form";
import { BabyNotification } from "~/features/baby-notification/types/baby-notification.types";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/shared/components/ui/form";
import { babyNotificationsValidator } from "~/features/baby-notification/validators/baby-notifications.validator";
import { Button } from "~/shared/components/ui/button";
import { useBabyNotification } from "~/features/baby-notification/hooks/use-baby-notification";
import { requirehardwareIdMiddleware } from "~/middlewares/require-hardware-id.middleware";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  await requirehardwareIdMiddleware(request);

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
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  const { id } = useParams<{ id: string }>();
  const { babyNotificationsQuery, handleUpdateBabyNotification } =
    useBabyNotification({ id, enableQuery: true });

  const form = useForm<BabyNotification>({
    resolver: zodResolver(babyNotificationsValidator),
    defaultValues: babyNotificationsQuery.data,
  });

  return (
    <PageLayout
      backLink={{ name: "Kembali", href: "/baby-notifications" }}
      title={`Notifikasi - ${babyNotificationsQuery.data?.title}`}
      description={`${
        babyNotificationsQuery.data?.created_at
          ? formatDateYYYYMMDD(
              new Date(babyNotificationsQuery.data?.created_at),
            )
          : "-"
      }`}
    >
      <div className="flex flex-col md:flex-row gap-6">
        <Image
          src={babyNotificationsQuery.data?.picture}
          className="rounded-lg shadow border border-border md:w-4/5"
        />

        <aside className="border border-border grow bg-card shadow rounded-lg flex flex-col sm:flex-row md:flex-col justify-between">
          <NumberStatsWithIcon
            classNames={{ wrapper: "grow" }}
            icon={ThermometerSunIcon}
            title="Suhu Celcius"
            value={`${babyNotificationsQuery.data?.temp_celcius ?? "-"}°C`}
          />

          <Separator orientation={isSmallScreen ? "vertical" : "horizontal"} />

          <NumberStatsWithIcon
            classNames={{ wrapper: "grow" }}
            icon={ThermometerSunIcon}
            title="Suhu Farenheit"
            value={`${babyNotificationsQuery.data?.temp_farenheit ?? "-"}°F`}
          />

          <Separator orientation={isSmallScreen ? "vertical" : "horizontal"} />

          <NumberStatsWithIcon
            classNames={{ wrapper: "grow" }}
            icon={DropletsIcon}
            title="Kelembapan"
            value={`${babyNotificationsQuery.data?.humidity ?? "-"}%`}
          />
        </aside>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleUpdateBabyNotification)}
          className="mt-6 space-y-10"
        >
          <FormField
            control={form.control}
            name="clarification"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Klarifikasi (Opsional)</FormLabel>

                <FormControl>
                  <Textarea
                    {...field}
                    disabled={form.formState.isSubmitting}
                    placeholder="Klarifikasi masih kosong..."
                  />
                </FormControl>
                <FormDescription className="flex items-center gap-2">
                  <InfoIcon className="size-4" />
                  <span>
                    Klarifikasi akan digunakan untuk membantu AI dalam membuat
                    schedule untuk bayi.
                  </span>
                </FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={form.formState.isSubmitting}
            type="submit"
            className="self-end w-full md:w-max"
          >
            <SaveIcon className="size-7" />
            Simpan Klarifikasi
          </Button>
        </form>
      </Form>
    </PageLayout>
  );
};
