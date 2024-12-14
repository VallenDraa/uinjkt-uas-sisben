import * as React from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import stylesheet from "~/global.css?url";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./shared/components/elements/sonner";
import { queryConfig } from "./lib/react-query";
import { envLoader } from "./config/env";
import { ErrorLayout } from "./shared/components/layouts/error-layout";
import { useNotifications } from "./shared/hooks/use-notification";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  { rel: "stylesheet", href: stylesheet },
];

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="id">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="dark">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
};

// Expose some environment variables to the client
export const loader = async () => {
  return {
    ...envLoader(),
  };
};

export default function App() {
  const { env } = useLoaderData<typeof loader>();
  const [queryClient] = React.useState(
    () => new QueryClient({ defaultOptions: queryConfig }),
  );

  useNotifications();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.env = ${JSON.stringify(env)}`,
        }}
      />
    </QueryClientProvider>
  );
}

export const ErrorBoundary = () => {
  const error = useRouteError();

  return (
    <html lang="id">
      <head>
        <title>Oops!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <ErrorLayout error={error} />
        <Scripts />
      </body>
    </html>
  );
};
