import { FilterParameters } from "../types/api.types";

export const DEFAULT_DATA_FILTERS: FilterParameters = {
  ordering: undefined,
  search: undefined,
  created_at__range: undefined,
  page: "1",
};
