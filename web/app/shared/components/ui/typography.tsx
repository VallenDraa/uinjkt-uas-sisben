import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/shared/utils/shadcn";

export const typographyVariants = cva("", {
  variants: {
    variant: {
      h1: "text-4xl font-medium tracking-tight lg:text-5xl",
      h2: "text-2xl font-medium tracking-tight lg:text-3xl",
      h3: "text-xl font-medium tracking-tight lg:text-2xl",
      h4: "text-lg font-medium tracking-tight lg:text-xl",
      lead: "text-lg text-muted-foreground lg:text-xl",
      large: "text-md font-medium lg:text-lg",
      small: "text-sm font-medium leading-none",
      muted: "text-sm text-muted-foreground",
      p: "leading-7",
      blockquote: "mt-6 border-l-2 pl-6 italic",
      code: "rounded-md bg-muted px-[0.4rem] py-[0.2rem] font-mono text-sm font-medium",
      label: "text-sm font-medium leading-none cursor-pointer h-6",
      error: "text-sm font-medium text-destructive",
    },
  },
  defaultVariants: {
    variant: "p",
  },
});

export type TypographyProps<TElement extends React.ElementType> =
  React.ComponentPropsWithoutRef<TElement> &
    VariantProps<typeof typographyVariants> & {
      className?: string;
      asChild?: boolean;
      tag: TElement;
    };

export const Typography = <TElement extends React.ElementType>({
  tag,
  className,
  variant,
  asChild = false,
  ...props
}: TypographyProps<TElement>) => {
  const Comp = asChild ? Slot : tag;

  return (
    <Comp
      className={cn(typographyVariants({ variant, className }))}
      {...props}
    />
  );
};

Typography.displayName = "Typography";
