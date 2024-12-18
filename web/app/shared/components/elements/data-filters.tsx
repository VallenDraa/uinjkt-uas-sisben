import * as React from "react";
import { Input } from "~/shared/components/ui/input";
import { FilterParameters } from "~/shared/types/api.types";
import { cn } from "~/shared/utils/shadcn";
import { DateRange, DateRangePickerDialog } from "./date-range-picker-dialog";
import { formatDateYYYYMMDD } from "~/shared/utils/formatter";
import { useDebouncedCallback } from "use-debounce";

export type DataFiltersProps = {
  filters: FilterParameters;
  setFilters: (filters: FilterParameters) => void;
  classNames?: { wrapper?: string };
};

export const DataFilters = ({
  filters,
  setFilters,
  classNames,
}: DataFiltersProps) => {
  const currentDate = React.useRef(new Date());

  const [innerSearch, setInnerSearch] = React.useState(filters.search ?? "");
  const [innerDateRange, setInnerDateRange] = React.useState<DateRange>(() => {
    const [from, to] = (filters.created_at__range ?? "").split(",");
    return {
      from: from ? new Date(from) : currentDate.current,
      to: to ? new Date(to) : currentDate.current,
    };
  });
  const debouncedSearch = useDebouncedCallback(
    React.useCallback(
      (newSearch: string) => setFilters({ ...filters, search: newSearch }),
      [filters, setFilters],
    ),
    800,
  );

  return (
    <div
      className={cn(
        "flex items-end md:items-center gap-4 w-full flex-wrap",
        classNames?.wrapper,
      )}
    >
      <div className="flex flex-col-reverse flex-wrap md:flex-nowrap md:flex-row items-start md:items-center gap-2 grow">
        <Input
          type="text"
          placeholder="Cari Notifikasi..."
          value={innerSearch}
          onChange={e => {
            const newSearch = e.target.value;

            setInnerSearch(newSearch);
            debouncedSearch(newSearch);
          }}
        />
        <DateRangePickerDialog
          calendarProps={{
            disabled: { after: new Date() },
          }}
          onUpdate={({ from, to }) => {
            setInnerDateRange({ from, to });
            setFilters({
              created_at__range: `${`${formatDateYYYYMMDD(
                from,
              )}T00:00:00`},${`${formatDateYYYYMMDD(to ?? from)}T23:59:59`}`,
            });
          }}
          range={{
            from: innerDateRange?.from ?? currentDate.current,
            to: innerDateRange?.to ?? currentDate.current,
          }}
          setRange={setInnerDateRange}
          initialDateFrom={formatDateYYYYMMDD(currentDate.current)}
          initialDateTo={formatDateYYYYMMDD(currentDate.current)}
        />
      </div>
    </div>
  );
};
