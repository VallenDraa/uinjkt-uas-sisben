import * as React from "react";
import { Input } from "~/shared/components/ui/input";
import { FilterParameters } from "~/shared/models/api.types";
import { cn } from "~/shared/utils/shadcn";
import { DateRangePicker } from "./date-range-picker";
import { formatDate, formatDateYYYYMMDD } from "~/shared/utils/formatter";

export type DataFiltersProps = {
  filters: FilterParameters;
  setFilters: (filters: FilterParameters) => void;
  classNames?: {
    wrapper?: string;
  };
};

export const DataFilters = ({
  filters,
  setFilters,
  classNames,
}: DataFiltersProps) => {
  const currentDate = React.useRef(new Date());

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
          value={filters.search}
          onChange={e => setFilters({ ...filters, search: e.target.value })}
        />
        <DateRangePicker
          onUpdate={values => {
            const { from, to } = values.range;

            setFilters({
              created_at__range: `${formatDateYYYYMMDD(
                from,
              )},${formatDateYYYYMMDD(to ?? from)}`,
            });
          }}
          initialDateFrom={formatDateYYYYMMDD(currentDate.current)}
          initialDateTo={formatDateYYYYMMDD(currentDate.current)}
        />
      </div>
    </div>
  );
};
