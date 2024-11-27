import * as React from "react";
import { useSearchParams } from "@remix-run/react";
import { FilterParameters } from "../models/api.types";

export type UseDataFiltersReturn<TValue extends Record<string, string>> = {
  filters: TValue;
  setFilters: (filters: TValue) => void;
};

export type useDataFiltersOptions<TValue extends Record<string, string>> = {
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
  }, []);
  const setParamFilters = React.useCallback((newValues: TValue) => {
    const newParams = new URLSearchParams(newValues);
    innerSetParamFilters(newParams);
  }, []);

  const [stateFilters, setStateFilters] = React.useState<TValue>(defaultValues);

  return {
    filters: useQueryParams ? serializedParamFilters : stateFilters,
    setFilters: useQueryParams ? setParamFilters : setStateFilters,
  };
};
