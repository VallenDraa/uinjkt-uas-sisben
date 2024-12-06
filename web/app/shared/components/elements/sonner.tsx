import {
  InfoIcon,
  LoaderCircleIcon,
  CheckIcon,
  CircleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      richColors
      closeButton
      position="bottom-center"
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      icons={{
        error: <CircleAlertIcon className="size-4" />,
        loading: <LoaderCircleIcon className="size-4 animate-spin" />,
        info: <InfoIcon className="size-4" />,
        success: <CheckIcon className="size-4" />,
      }}
      {...props}
    />
  );
};
