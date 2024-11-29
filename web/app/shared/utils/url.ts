export const getSearchParamsFromUrl = <
  TSearchParams extends Record<string, string>,
>(
  url: URL,
) => {
  return Object.fromEntries(url.searchParams.entries()) as TSearchParams;
};
