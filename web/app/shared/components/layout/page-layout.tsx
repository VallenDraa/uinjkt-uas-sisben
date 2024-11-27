import * as React from "react";
import { cn } from "~/shared/utils/shadcn";

export type PageLayoutProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

export const PageLayout = ({
  children,
  className,
  ...props
}: PageLayoutProps) => {
  return (
    <div
      {...props}
      className={cn("relative max-w-[960px] mx-auto px-4", className)}
    >
      <div
        role="presentation"
        className="h-28 inset-x-0 bg-gradient-to-b from-green-600/20 via-green-300/20  dark:from-green-300/20 dark:via-green-800/20 to-transparent fixed top-0"
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
};
