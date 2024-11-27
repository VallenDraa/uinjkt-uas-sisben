import type { MetaFunction } from "@remix-run/node";
import { CurrentDateTime } from "~/shared/components/elements/current-date-time";
import { PageLayout } from "~/shared/components/layout/page-layout";
import { Typography } from "~/shared/components/ui/typography";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <PageLayout>
      <header className="pt-16 space-y-6">
        <CurrentDateTime />

        <div className="space-y-2">
          <Typography variant="h2" tag="h1">
            Selamat Datang 👋
          </Typography>
          <Typography variant="lead" tag="p">
            di <i>Monitoor</i>, no BS all-in-one solution untuk monitoring dan
            perawatan bayi anda.
          </Typography>
        </div>
      </header>

      <main></main>

      <footer></footer>
    </PageLayout>
  );
}
