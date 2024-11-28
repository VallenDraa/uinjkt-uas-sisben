import * as React from "react";
import { useSearchParams } from "@remix-run/react";

export type UseDataFiltersReturn<TValue extends Record<string, string>> = {
  filters: TValue;
  setFilters: (filters: TValue) => void;
};

export type useDataFiltersOptions<
  TValue extends Record<string, string | number>,
> = {
  useQueryParams?: boolean;
  defaultValues: TValue;
};

export const useDataFilters = <TValue extends Record<string, string>>({
  defaultValues,
  useQueryParams,
}: useDataFiltersOptions<TValue>): UseDataFiltersReturn<TValue> => {
  const [paramFilters, innerSetParamFilters] = useSearchParams();
  const serializedParamFilters = React.useMemo(() => {
    const serialized = Object.fromEntries(paramFilters.entries()) as TValue;
    return serialized;
  }, [paramFilters]);
  const setParamFilters = React.useCallback(
    (newValues: TValue) => {
      innerSetParamFilters(prev => {
        const prevValues = Object.fromEntries(prev.entries());
        const newParams = new URLSearchParams({
          ...prevValues,
          ...newValues,
        });

        return newParams;
      });
    },
    [innerSetParamFilters],
  );

  const [stateFilters, setStateFilters] = React.useState<TValue>(defaultValues);

  return {
    filters: useQueryParams ? serializedParamFilters : stateFilters,
    setFilters: useQueryParams ? setParamFilters : setStateFilters,
  };
};
