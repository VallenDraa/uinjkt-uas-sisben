import { Image } from "~/shared/components/ui/image";
import { getVideoStreamUrl } from "../../utils/baby-monitoring.utils";

export type VideoStreamProps = {
  hardwareId: string;
};

export const VideoStream = ({ hardwareId }: VideoStreamProps) => {
  return (
    <Image
      src={getVideoStreamUrl(hardwareId)}
      className="rounded-lg w-full shadow border border-border aspect-[4/3]"
    />
  );
};
