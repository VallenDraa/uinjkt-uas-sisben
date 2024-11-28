import { LucideIcon } from "lucide-react";
import { Typography } from "~/shared/components/ui/typography";
import { cn } from "~/shared/utils/shadcn";

export type NumberStatsWithIconProps = {
  icon: LucideIcon;
  title: string;
  value: string;
  classNames?: {
    wrapper?: string;
    icon?: string;
    title?: string;
    value?: string;
    infoWrapper?: string;
  };
};

export const NumberStatsWithIcon = ({
  icon: Icon,
  title,
  value,
  classNames,
}: NumberStatsWithIconProps) => {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center flex-col p-4",
        classNames?.wrapper,
      )}
    >
      <Icon
        className={cn(
          "absolute top-2 right-2 opacity-10 size-20",
          classNames?.icon,
        )}
      />

      <div className={cn(classNames?.infoWrapper)}>
        <Typography
          tag="h2"
          variant="h4"
          className={cn("text-muted-foreground", classNames?.title)}
        >
          {title}
        </Typography>

        <Typography tag="p" variant="h1" className={cn(classNames?.value)}>
          {value}
        </Typography>
      </div>
    </div>
  );
};
