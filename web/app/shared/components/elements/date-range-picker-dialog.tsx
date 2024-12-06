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
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";
import { useMediaQuery } from "~/shared/hooks/use-media-query";
import { cn } from "~/shared/utils/shadcn";

export type DateRangePickerDialogProps = {
  disableUpdateButton?: boolean;
  disableCancelButton?: boolean;
  showHeader?: boolean;
  title?: string;
  description?: string;
  trigger?: React.ReactNode;
  cancelText?: string;
  updateText?: string;
  /** Click handler for applying the updates from DateRangePickerDialog. */
  onUpdate?: (range: DateRange) => void;
  /** Initial value for start date */
  initialDateFrom?: Date | string;
  /** Initial value for end date */
  initialDateTo?: Date | string;
  range?: DateRange;
  setRange?: React.Dispatch<React.SetStateAction<DateRange>>;
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

export type DateRange = { from: Date; to: Date | undefined };

export const DateRangePickerDialog = ({
  disableUpdateButton,
  disableCancelButton,
  showHeader = false,
  title,
  description,
  updateText,
  cancelText,
  trigger,
  initialDateFrom = new Date(new Date().setHours(0, 0, 0, 0)),
  initialDateTo,
  onUpdate,
  range,
  setRange,
}: DateRangePickerDialogProps): JSX.Element => {
  const isSmallScreen = useMediaQuery("(max-width: 640px)");
  const [isOpen, setIsOpen] = React.useState(false);

  const [innerRange, setInnerRange] = React.useState<DateRange>({
    from: getDateAdjustedForTimezone(initialDateFrom),
    to: initialDateTo
      ? getDateAdjustedForTimezone(initialDateTo)
      : getDateAdjustedForTimezone(initialDateFrom),
  });

  const rangeValue = range ?? innerRange;
  const setRangeValue = setRange ?? setInnerRange;

  const resetValues = React.useCallback((): void => {
    setRangeValue({
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
  }, [initialDateFrom, initialDateTo, setRangeValue]);

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
        {trigger ?? (
          <Button variant="outline">
            <CalendarIcon className="size-4" />

            <Typography tag="span" variant="label" className="h-auto">
              {`${formatDate(rangeValue.from)}${
                rangeValue.to != null ? " - " + formatDate(rangeValue.to) : ""
              }`}
            </Typography>
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent>
        <div className="max-w-[960px] mx-auto w-full pt-4">
          <DrawerHeader className={cn(showHeader ? "mb-4" : "sr-only")}>
            <DrawerTitle>{title ?? "Date Range Picker Dialog"}</DrawerTitle>
            <DrawerDescription>
              {description ?? "Date Range Picker Dialog"}
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex gap-2 items-center justify-center">
            <DateInput
              value={rangeValue.from}
              onChange={date => {
                const toDate =
                  rangeValue.to == null || date > rangeValue.to
                    ? date
                    : rangeValue.to;
                setRangeValue(prevRange => ({
                  ...prevRange,
                  from: date,
                  to: toDate,
                }));
              }}
            />
            <div className="py-1">-</div>
            <DateInput
              value={rangeValue.to}
              onChange={date => {
                const fromDate =
                  date < rangeValue.from ? date : rangeValue.from;
                setRangeValue(prevRange => ({
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
                setRangeValue({ from: value.from, to: value?.to });
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
              disabled={disableUpdateButton}
              onClick={() => {
                setIsOpen(false);
                onUpdate?.(rangeValue);
              }}
            >
              {updateText ?? "Perbarui"}
            </Button>

            <DrawerClose asChild>
              <Button
                disabled={disableCancelButton}
                onClick={() => {
                  setIsOpen(false);
                  resetValues();
                }}
                variant="ghost"
              >
                {cancelText ?? "Tutup"}
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

DateRangePickerDialog.displayName = "DateRangePickerDialog";
