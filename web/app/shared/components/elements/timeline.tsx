import * as React from "react";
import { cn } from "~/shared/utils/shadcn";
import { typographyVariants } from "../ui/typography";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";

export type TimelineItemSkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  amount: number;
};
export const TimelineItemSkeleton = ({
  amount,
  className,
  ...props
}: TimelineItemSkeletonProps) => {
  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      {Array.from({ length: amount }).map((_, index) => {
        return <Skeleton key={index} className="w-full h-32" />;
      })}
    </div>
  );
};

export const Timeline = React.forwardRef<
  HTMLOListElement,
  React.HTMLAttributes<HTMLOListElement>
>(({ className, ...props }, ref) => (
  <ol ref={ref} className={cn(className)} {...props} />
));
Timeline.displayName = "Timeline";

export const TimelineItem = React.forwardRef<
  HTMLLIElement,
  React.LiHTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("group relative pb-12 pl-8 sm:pl-36", className)}
    {...props}
  />
));
TimelineItem.displayName = "TimelineItem";

export const TimelineTime = ({
  className,
  variant = "secondary",
  ...props
}: React.ComponentProps<typeof Badge>) => (
  <Badge
    variant={variant}
    className={cn(
      "left-0 mb-3 items-center justify-center sm:absolute sm:mb-0",
      className,
    )}
    {...props}
  />
);

export const TimelineHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "mb-4 sm:mb-1.5 flex flex-col items-start sm:flex-row sm:before:left-0 sm:before:ml-28 sm:after:left-0 sm:after:ml-28",
      // Timeline connector
      "before:absolute before:left-2 sm:before:-left-0 before:h-full before:-translate-x-1/2 before:self-start before:border-l-[3px] before:border-dashed before:border-foreground/20",
      // Timeline dot
      "after:absolute after:left-2 sm:before:-left-0 after:box-content after:size-2 after:-translate-x-1/2 after:translate-y-1.5 after:rounded-full after:ring-2 after:ring-offset-2 after:ring-offset-primary after:ring-primary after:bg-background",
      className,
    )}
    {...props}
  />
));
TimelineHeader.displayName = "TimelineHeader";

export const TimelineTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      typographyVariants({ variant: "h4" }),
      "leading-3",
      className,
    )}
    {...props}
  >
    {children}
  </h3>
));
TimelineTitle.displayName = "TimelineTitle";

export const TimelineDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(typographyVariants({ variant: "lead-small" }), className)}
    {...props}
  />
));
TimelineDescription.displayName = "TimelineDescription";
