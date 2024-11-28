import ReactPlayer from "react-player/file";
import { PageLayout } from "~/shared/components/layouts/page-layout";
import { useIsClient } from "~/shared/hooks/use-is-client";

export default function BabyMonitoringPageWrapper() {
  const isClient = useIsClient();

  return isClient ? <BabyMonitoringPage /> : null;
}

const BabyMonitoringPage = () => {
  return (
    <PageLayout title="Monitoring" backLink={{ name: "Kembali", href: "/" }}>
      <ReactPlayer playing muted controls />
    </PageLayout>
  );
};
