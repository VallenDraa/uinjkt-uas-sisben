import { isRouteErrorResponse } from "@remix-run/react";
import { PageLayout } from "./page-layout";
import { AlertCircleIcon } from "lucide-react";
import { Typography } from "../ui/typography";

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
        main: "flex justify-center items-center",
      }}
    >
      <div className="text-center text-muted-foreground">
        <AlertCircleIcon className="size-16 mx-auto my-auto" />
        <Typography variant="h2" className="mt-2" tag="p">
          Oops terjadi error...
        </Typography>
      </div>
    </PageLayout>
  );
};
