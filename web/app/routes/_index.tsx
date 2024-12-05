import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { requirehardwareIdMiddleware } from "~/middlewares/require-hardware-id.middleware";
import { LinkCard } from "~/shared/components/elements/link-card";
import { PageLayout } from "~/shared/components/layouts/page-layout";
import { BABY_MENU_ITEMS } from "~/shared/constants/menu.contants";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requirehardwareIdMiddleware(request);

  return null;
};

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <PageLayout
      classNames={{ main: "grid md:grid-cols-2 gap-6 grow-0 overflow-visible" }}
      title="Selamat Datang 👋"
      description={
        <>
          di <i>Seebaby</i>, no BS all-in-one solution untuk monitoring dan
          perawatan bayi anda.
        </>
      }
    >
      {BABY_MENU_ITEMS.map(item => {
        return (
          <LinkCard
            key={item.name}
            description={item.description}
            href={item.href}
            icon={item.icon}
            name={item.name}
          />
        );
      })}
    </PageLayout>
  );
}
