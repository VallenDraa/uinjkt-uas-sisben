import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { DropletsIcon, ThermometerSunIcon } from "lucide-react";
import { NumberStatsWithIcon } from "~/features/baby-monitoring/components/elements/number-stats-with-icon";
import { VideoStream } from "~/features/baby-monitoring/components/elements/video-stream";
import { useBabyMonitoringTempsHumidityWebSocket } from "~/features/baby-monitoring/websockets/baby-monitoring-temps-humidity.websocket";
import { requirehardwareIdMiddleware } from "~/middlewares/require-hardware-id.middleware";
import { PageLayout } from "~/shared/components/layouts/page-layout";
import { Separator } from "~/shared/components/ui/separator";
import { useIsClient } from "~/shared/hooks/use-is-client";
import { useMediaQuery } from "~/shared/hooks/use-media-query";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { hardwareId } = await requirehardwareIdMiddleware(request);
  return { hardwareId };
};

export default function BabyMonitoringPageWrapper() {
  const isClient = useIsClient();

  return isClient ? <BabyMonitoringPage /> : null;
}

const BabyMonitoringPage = () => {
  const { hardwareId } = useLoaderData<typeof loader>();
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  const { lastJsonMessage: tempsHumidityData } =
    useBabyMonitoringTempsHumidityWebSocket(hardwareId);

  return (
    <PageLayout
      title="Monitoring Bayi"
      description="Monitor untuk bayi, suhu, dan kelembapan ruangan."
      classNames={{ main: "overflow-auto" }}
      backLink={{ name: "Kembali", href: "/" }}
    >
      <div className="flex flex-col lg:flex-row gap-6">
        <VideoStream hardwareId={hardwareId} />

        <aside className="basis-full lg:basis-64 border border-border bg-card shadow rounded-lg flex flex-col sm:flex-row md:flex-col justify-between">
          <NumberStatsWithIcon
            classNames={{ wrapper: "grow" }}
            icon={ThermometerSunIcon}
            title="Suhu Celcius"
            value={`${tempsHumidityData?.temp_celcius ?? "-"}°C`}
          />

          <Separator orientation={isSmallScreen ? "vertical" : "horizontal"} />

          <NumberStatsWithIcon
            classNames={{ wrapper: "grow" }}
            icon={ThermometerSunIcon}
            title="Suhu Farenheit"
            value={`${tempsHumidityData?.temp_farenheit ?? "-"}°F`}
          />

          <Separator orientation={isSmallScreen ? "vertical" : "horizontal"} />

          <NumberStatsWithIcon
            classNames={{ wrapper: "grow" }}
            icon={DropletsIcon}
            title="Kelembapan"
            value={`${tempsHumidityData?.humidity ?? "-"}%`}
          />
        </aside>
      </div>
    </PageLayout>
  );
};
