import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { DropletsIcon, ThermometerSunIcon } from "lucide-react";
import { NumberStatsWithIcon } from "~/features/baby-monitoring/components/elements/number-stats-with-icon";
import { useBabyMonitoringTempsHumidityWebSocket } from "~/features/baby-monitoring/websockets/baby-monitoring-temps-humidity.websocket";
import { requirehardwareCodeMiddleware } from "~/middlewares/require-hardware-code.middleware";
import { PageLayout } from "~/shared/components/layouts/page-layout";
import { Separator } from "~/shared/components/ui/separator";
import { useIsClient } from "~/shared/hooks/use-is-client";
import { useMediaQuery } from "~/shared/hooks/use-media-query";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { hardwareCode } = await requirehardwareCodeMiddleware(request);
  return { hardwareCode };
};

export default function BabyMonitoringPageWrapper() {
  const isClient = useIsClient();

  return isClient ? <BabyMonitoringPage /> : null;
}

const BabyMonitoringPage = () => {
  const { hardwareCode } = useLoaderData<typeof loader>();
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  const { lastJsonMessage } =
    useBabyMonitoringTempsHumidityWebSocket(hardwareCode);

  return (
    <PageLayout
      title="Monitoring Bayi"
      description="Monitor untuk bayi, suhu, dan kelembapan ruangan."
      classNames={{ main: "overflow-auto" }}
      backLink={{ name: "Kembali", href: "/" }}
    >
      <div className="flex flex-col md:flex-row gap-6">
        <video
          autoPlay
          muted
          controls
          src="/stock.mp4"
          className="rounded-lg w-full shadow border border-border aspect-video"
        />

        <aside className="basis-full md:basis-56 border border-border bg-card shadow rounded-lg flex flex-col sm:flex-row md:flex-col justify-between">
          <NumberStatsWithIcon
            classNames={{ wrapper: "grow" }}
            icon={ThermometerSunIcon}
            title="Suhu Celcius"
            value={`${lastJsonMessage?.tempCelcius ?? "-"}°C`}
          />

          <Separator orientation={isSmallScreen ? "vertical" : "horizontal"} />

          <NumberStatsWithIcon
            classNames={{ wrapper: "grow" }}
            icon={ThermometerSunIcon}
            title="Suhu Farenheit"
            value={`${lastJsonMessage?.tempFarenheit ?? "-"}°F`}
          />

          <Separator orientation={isSmallScreen ? "vertical" : "horizontal"} />

          <NumberStatsWithIcon
            classNames={{ wrapper: "grow" }}
            icon={DropletsIcon}
            title="Kelembapan"
            value={`${lastJsonMessage?.humidity ?? "-"}%`}
          />
        </aside>
      </div>
    </PageLayout>
  );
};
