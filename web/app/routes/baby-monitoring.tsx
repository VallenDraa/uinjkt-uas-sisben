import ReactPlayer from "react-player/file";
import { PageLayout } from "~/shared/components/layouts/page-layout";
import { BABY_MONITORING_VIDEO_STREAM_URL } from "~/features/baby-monitoring/constants/baby-monitoring.constants";

export default function BabyMonitoringPage() {
  return (
    <PageLayout title="Monitoring" backLink={{ name: "Kembali", href: "/" }}>
      <ReactPlayer
        playing
        muted
        controls
        url={BABY_MONITORING_VIDEO_STREAM_URL}
      />
    </PageLayout>
  );
}
