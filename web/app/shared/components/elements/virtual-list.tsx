import * as React from "react";
import {
  useVirtualizer,
  VirtualItem,
  VirtualizerOptions,
} from "@tanstack/react-virtual";
import { cn } from "~/shared/utils/shadcn";
import { Skeleton } from "~/shared/components/ui/skeleton";
import {
  useIntersectionObserver,
  UseIntersectionObserverOptions,
} from "~/shared/hooks/use-intersection-observer";
import { ScrollArea } from "../ui/scroll-area";
import { Loader2Icon } from "lucide-react";

export type VirtualListProps<TItem> = Omit<
  React.HTMLAttributes<HTMLUListElement>,
  "className" | "children"
> & {
  items: TItem[];
  virtualOptions?: Partial<
    Omit<VirtualizerOptions<HTMLDivElement, Element>, "getScrollElement"> & {
      defaultItemSize?: number;
    }
  >;
  intersectionObserverOptions?: UseIntersectionObserverOptions;
  classNames?: {
    wrapper?: string;
    list?: string;
    item?: string;
    itemSkeletonWrapper?: string;
    itemSkeleton?: string;
  };
  children: React.FC<{
    item: TItem | undefined;
    virtualItem: VirtualItem;
    items: TItem[];
  }>;
};

export const VirtualList = <TItem,>({
  items,
  children,
  virtualOptions,
  classNames,
  intersectionObserverOptions,
  style,
  ...props
}: VirtualListProps<TItem>) => {
  const Children = children;
  const parentRef = React.useRef<HTMLDivElement>(null);

  const itemVirtualizer = useVirtualizer({
    ...virtualOptions,
    estimateSize:
      virtualOptions?.estimateSize ??
      (() => virtualOptions?.defaultItemSize ?? 100),
    count: virtualOptions?.count ?? items.length,
    getScrollElement: () => parentRef.current,
  });

  React.useLayoutEffect(() => {
    itemVirtualizer?.measure?.();
  }, [itemVirtualizer, virtualOptions?.defaultItemSize]);

  const [intersectorRef] = useIntersectionObserver({
    ...intersectionObserverOptions,
  });

  return (
    <ScrollArea>
      <div
        className={cn("overflow-y-auto", classNames?.wrapper)}
        ref={parentRef}
      >
        <ul
          {...props}
          className={cn(classNames?.list, "w-full relative")}
          style={{ ...style, height: `${itemVirtualizer.getTotalSize()}px` }}
        >
          {itemVirtualizer.getVirtualItems().map(virtualItem => {
            const isIntersector = virtualItem.index > items.length - 1;
            const item = items[virtualItem.index];

            return isIntersector ? (
              <VirtualListItem
                ref={intersectorRef}
                key={virtualItem.key}
                className={cn(classNames?.itemSkeletonWrapper)}
                virtualOptions={virtualItem}
              >
                <Skeleton className="h-full w-full" />
              </VirtualListItem>
            ) : (
              <VirtualListItem
                key={virtualItem.key}
                className={cn(classNames?.item)}
                virtualOptions={virtualItem}
              >
                <Children item={item} items={items} virtualItem={virtualItem} />
              </VirtualListItem>
            );
          })}
        </ul>
      </div>
    </ScrollArea>
  );
};

export type VirtualListItemProps = React.HTMLAttributes<HTMLLIElement> & {
  virtualOptions: VirtualItem;
};

export const VirtualListItem = React.forwardRef<
  HTMLLIElement,
  VirtualListItemProps
>(({ className, children, style, virtualOptions, ...props }, ref) => {
  return (
    <li
      {...props}
      ref={ref}
      className={cn(className, "absolute top-0 left-0 w-full")}
      style={{
        ...style,
        height: `${virtualOptions.size}px`,
        transform: `translateY(${virtualOptions.start}px)`,
      }}
    >
      {children}
    </li>
  );
});
