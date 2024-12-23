export type PaginatedApiResponse<TResults> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: TResults;
};

export type FilterParameters = {
  page?: string;
  search?: string;
  ordering?: "created_at" | "-created_at";
  created_at__range?: `${string},${string}`;
};
