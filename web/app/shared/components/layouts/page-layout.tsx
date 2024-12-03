import * as React from "react";
import { cn } from "~/shared/utils/shadcn";
import { CurrentDateTime } from "../elements/current-date-time";
import { Typography } from "../ui/typography";
import { Link } from "@remix-run/react";
import { buttonVariants } from "../ui/button";
import { MoveLeftIcon } from "lucide-react";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";

export type PageLayoutProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "className"
> & {
  backLink?: { name: string; href: string; className?: string };
  showDateTime?: boolean;
  children?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  classNames?: {
    wrapper?: string;
    gradient?: string;
    header?: string;
    main?: string;
    footer?: string;
  };
};

export const PageLayout = ({
  children,
  showDateTime = true,
  title,
  description,
  classNames,
  backLink,
  ...props
}: PageLayoutProps) => {
  return (
    <div
      {...props}
      className={cn(
        "relative max-w-[960px] mx-auto min-h-screen flex flex-col",
        classNames?.wrapper,
      )}
    >
      <div
        role="presentation"
        className={cn(
          "h-40 inset-x-0 bg-gradient-to-b from-green-600/30 via-green-300/30  dark:from-green-300/20 dark:via-green-800/20 to-transparent fixed top-0",
          classNames?.gradient,
        )}
      />

      <header
        className={cn("pt-10 space-y-6 relative z-10 px-4", classNames?.header)}
      >
        {backLink && (
          <Link
            className={cn(
              buttonVariants({ variant: "link", size: "lg" }),
              "px-0",
              backLink.className,
            )}
            to={backLink.href}
          >
            <MoveLeftIcon className="size-4 mr-2" />
            {backLink.name}
          </Link>
        )}

        {showDateTime && <CurrentDateTime />}

        <div className="space-y-2">
          <Typography variant="h2" tag="h1">
            {title}
          </Typography>

          {description && (
            <Typography variant="lead" tag="p">
              {description}
            </Typography>
          )}
        </div>
      </header>

      <ScrollArea>
        <main className={cn("grow py-6 px-4", classNames?.main)}>
          {children}
        </main>
      </ScrollArea>

      <footer className={cn("pb-6 space-y-6 mt-auto px-4", classNames?.footer)}>
        <Separator />
        <Typography tag="p" variant="muted" className="text-center">
          &copy; {new Date().getFullYear()} Seebaby - Dibuat dengan ❤️ untuk 👶
          dan sisben.
        </Typography>
      </footer>
    </div>
  );
};
