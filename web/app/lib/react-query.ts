/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  type UseMutationOptions,
  type DefaultOptions,
} from "@tanstack/react-query";

export const queryConfig = {
  queries: {
    refetchOnWindowFocus: false,
    retry: false,
    // With SSR, we usually want to set some default staleTime
    // above 0 to avoid refetching immediately on the client
    staleTime: 60 * 1000,
  },
} satisfies DefaultOptions;

export type ApiFnReturnType<FnType extends (..._args: any[]) => Promise<any>> =
  Awaited<ReturnType<FnType>>;

export type QueryConfig<T extends (..._args: any[]) => any> = Omit<
  ReturnType<T>,
  "queryKey" | "queryFn"
>;

export type MutationConfig<
  TMutationFnType extends (..._args: any[]) => Promise<any>,
  TParameters = Parameters<TMutationFnType>[0],
> = UseMutationOptions<ApiFnReturnType<TMutationFnType>, Error, TParameters>;
