import { isRouteErrorResponse } from "@remix-run/react";
import { PageLayout } from "./page-layout";

export type ErrorLayoutProps = {
  error: unknown;
};

export const ErrorLayout = ({ error }: ErrorLayoutProps) => {
  const isRouteError = isRouteErrorResponse(error);

  let title: string;
  let description: string;

  if (isRouteError) {
    title = `Error ${error.status}`;
    description = error.statusText;
  } else if (error instanceof Error) {
    title = error.message;
    description = error.message;
  } else {
    title = "Unknown Error";
    description = "Unknown Error";
  }

  return (
    <PageLayout
      backLink={{ href: "/", name: "Kembali" }}
      title={title}
      description={description}
      showDateTime={false}
      classNames={{
        header: "grow flex justify-center items-start flex-col-reverse",
      }}
    />
  );
};
