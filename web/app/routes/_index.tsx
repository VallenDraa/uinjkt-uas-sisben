import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { MoveRightIcon } from "lucide-react";
import { PageLayout } from "~/shared/components/layouts/page-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/shared/components/elements/card";
import { Typography } from "~/shared/components/ui/typography";
import { BABY_MENU_ITEMS } from "~/shared/constants/menu.contants";

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
        const Icon = item.icon;

        return (
          <Link key={item.name} to={item.href} className="group inline">
            <Card className="relative group-hover:border-primary/50 group-hover:shadow-md group-hover:shadow-primary/10 transition duration-300 group-hover:-translate-y-1 group-hover:scale-[100.5%]">
              <CardHeader className="relative z-10">
                <CardTitle className="transition-colors duration-300 group-hover:text-primary">
                  {item.name}
                </CardTitle>
                <CardDescription className="transition-colors duration-300 group-hover:text-primary">
                  {item.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="text-right">
                <Icon className="absolute top-6 right-6 opacity-10 size-24 group-hover:text-primary transition-colors duration-300" />

                <Typography
                  variant="lead"
                  tag="div"
                  className="duration-300 text-base md:text-base lg:text-base flex items-center gap-3 justify-end group-hover:text-primary"
                >
                  <span>{`Lihat ${item.name.toLowerCase()}`}</span>

                  <MoveRightIcon className="size-6" />
                </Typography>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </PageLayout>
  );
}
