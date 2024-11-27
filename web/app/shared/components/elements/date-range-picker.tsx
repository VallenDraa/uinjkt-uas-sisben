import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "../ui/button";
import { formatDate } from "~/shared/utils/formatter";
import { Calendar } from "./calendar";
import { DateInput } from "./date-input";
import { Typography } from "../ui/typography";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "./drawer";
import { useMediaQuery } from "~/shared/hooks/use-media-query";

export type DateRangePickerProps = {
  /** Click handler for applying the updates from DateRangePicker. */
  onUpdate?: (values: { range: DateRange }) => void;
  /** Initial value for start date */
  initialDateFrom?: Date | string;
  /** Initial value for end date */
  initialDateTo?: Date | string;
};

const getDateAdjustedForTimezone = (dateInput: Date | string): Date => {
  if (typeof dateInput === "string") {
    // Split the date string to get year, month, and day parts
    const parts = dateInput.split("-").map(part => parseInt(part, 10));
    // Create a new Date object using the local timezone
    // Note: Month is 0-indexed, so subtract 1 from the month part
    const date = new Date(parts[0], parts[1] - 1, parts[2]);
    return date;
  } else {
    // If dateInput is already a Date object, return it directly
    return dateInput;
  }
};

type DateRange = {
  from: Date;
  to: Date | undefined;
};

export const DateRangePicker = ({
  initialDateFrom = new Date(new Date().setHours(0, 0, 0, 0)),
  initialDateTo,
  onUpdate,
}: DateRangePickerProps): JSX.Element => {
  const isSmallScreen = useMediaQuery("(max-width: 640px)");
  const [isOpen, setIsOpen] = React.useState(false);

  const [range, setRange] = React.useState<DateRange>({
    from: getDateAdjustedForTimezone(initialDateFrom),
    to: initialDateTo
      ? getDateAdjustedForTimezone(initialDateTo)
      : getDateAdjustedForTimezone(initialDateFrom),
  });

  const resetValues = React.useCallback((): void => {
    setRange({
      from:
        typeof initialDateFrom === "string"
          ? getDateAdjustedForTimezone(initialDateFrom)
          : initialDateFrom,
      to: initialDateTo
        ? typeof initialDateTo === "string"
          ? getDateAdjustedForTimezone(initialDateTo)
          : initialDateTo
        : typeof initialDateFrom === "string"
        ? getDateAdjustedForTimezone(initialDateFrom)
        : initialDateFrom,
    });
  }, []);

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) {
          resetValues();
        }
        setIsOpen(open);
      }}
    >
      <DrawerTrigger asChild>
        <Button variant="outline">
          <CalendarIcon className="size-4" />

          <Typography tag="span" variant="label" className="h-auto">
            {`${formatDate(range.from)}${
              range.to != null ? " - " + formatDate(range.to) : ""
            }`}
          </Typography>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="max-w-[960px] mx-auto w-full pt-4">
          <div className="flex gap-2 items-center justify-center">
            <DateInput
              value={range.from}
              onChange={date => {
                const toDate =
                  range.to == null || date > range.to ? date : range.to;
                setRange(prevRange => ({
                  ...prevRange,
                  from: date,
                  to: toDate,
                }));
              }}
            />
            <div className="py-1">-</div>
            <DateInput
              value={range.to}
              onChange={date => {
                const fromDate = date < range.from ? date : range.from;
                setRange(prevRange => ({
                  ...prevRange,
                  from: fromDate,
                  to: date,
                }));
              }}
            />
          </div>

          <Calendar
            mode="range"
            className="flex justify-center"
            onSelect={(value: { from?: Date; to?: Date } | undefined) => {
              if (value?.from != null) {
                setRange({ from: value.from, to: value?.to });
              }
            }}
            selected={range}
            numberOfMonths={isSmallScreen ? 1 : 2}
            defaultMonth={
              new Date(
                new Date().setMonth(
                  new Date().getMonth() - (isSmallScreen ? 0 : 1),
                ),
              )
            }
          />

          <DrawerFooter>
            <Button
              onClick={() => {
                setIsOpen(false);
                onUpdate?.({ range });
              }}
            >
              Perbarui
            </Button>

            <DrawerClose asChild>
              <Button
                onClick={() => {
                  setIsOpen(false);
                  resetValues();
                }}
                variant="ghost"
              >
                Tutup
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

DateRangePicker.displayName = "DateRangePicker";
