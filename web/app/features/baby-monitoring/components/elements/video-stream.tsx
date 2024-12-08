import * as React from "react";
import { Image } from "~/shared/components/ui/image";
import {
  getAudioStreamUrl,
  getVideoStreamUrl,
} from "../../utils/baby-monitoring.utils";
import { Button } from "~/shared/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/shared/components/ui/tooltip";
import { PauseIcon, PlayIcon, Volume2Icon, VolumeXIcon } from "lucide-react";
import { Slider } from "~/shared/components/ui/slider";

export type VideoStreamProps = {
  hardwareId: string;
};

export const VideoStream = ({ hardwareId }: VideoStreamProps) => {
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const [isVideoPlaying, setIsVideoPlaying] = React.useState(true);
  const toggleVideoPlaying = () => setIsVideoPlaying(prev => !prev);

  const [isAudioPlaying, setIsAudioPlaying] = React.useState(false);
  const toggleAudioPlaying = () => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }

      setIsAudioPlaying(prev => !prev);
    }
  };
  const changeAudioVolume = (sliderValues: number[]) => {
    if (audioRef.current) {
      audioRef.current.volume = sliderValues[0] / 100;
    }
  };

  return (
    <div className="rounded-lg w-full shadow border border-border aspect-[4/3] overflow-clip relative group">
      <Image
        showPlaceholder={!isVideoPlaying}
        src={getVideoStreamUrl(hardwareId)}
        className="w-full aspect-[4/3]"
      />

      <audio autoPlay={false} ref={audioRef} className="absolute top-0">
        <source src={getAudioStreamUrl(hardwareId)} type="audio/wav" />
        <track kind="captions" />
      </audio>

      <div className="absolute bottom-2 bg-background/20 backdrop-blur -translate-x-1/2 left-1/2 rounded-full py-2 px-10 border border-border/10 shadow transition-opacity opacity-0 duration-300 group-hover:opacity-100 group-has-[:focus]:opacity-100 flex flex-col justify-center gap-3.5">
        <Slider
          defaultValue={[100]}
          step={1}
          max={100}
          className="w-full"
          onValueChange={changeAudioVolume}
        />

        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  className="rounded-full aspect-square"
                  variant={isVideoPlaying ? "default" : "outline"}
                  onClick={toggleVideoPlaying}
                >
                  {isVideoPlaying ? (
                    <PauseIcon className="size-5" />
                  ) : (
                    <PlayIcon className="size-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent
                className={
                  isVideoPlaying
                    ? "bg-primary text-primary-foreground"
                    : "bg-popover text-popover-foreground"
                }
              >
                <p>{isVideoPlaying ? "Pause Video" : "Putar Video"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  className="rounded-full aspect-square"
                  variant={isAudioPlaying ? "default" : "outline"}
                  onClick={toggleAudioPlaying}
                >
                  {isAudioPlaying ? (
                    <Volume2Icon className="size-5" />
                  ) : (
                    <VolumeXIcon className="size-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent
                className={
                  isAudioPlaying
                    ? "bg-primary text-primary-foreground"
                    : "bg-popover text-popover-foreground"
                }
              >
                <p>{isAudioPlaying ? "Pause Suara" : "Putar Suara"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};
