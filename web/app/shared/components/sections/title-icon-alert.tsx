import { LucideIcon } from "lucide-react";
import { Typography } from "../ui/typography";
import { cn } from "~/shared/utils/shadcn";

export type TitleIconAlertProps = {
  icon: LucideIcon;
  description: string;
  classNames?: { icon?: string; wrapper?: string; description?: string };
};

export const TitleIconAlert = ({
  icon: Icon,
  description,
  classNames,
}: TitleIconAlertProps) => {
  return (
    <div
      className={cn("text-center text-muted-foreground", classNames?.wrapper)}
    >
      <Icon
        strokeWidth={1}
        className={cn("size-16 mx-auto my-auto", classNames?.icon)}
      />

      <Typography
        variant="h4"
        className={cn("mt-2 max-w-sm mx-auto", classNames?.description)}
        tag="p"
      >
        {description}
      </Typography>
    </div>
  );
};
