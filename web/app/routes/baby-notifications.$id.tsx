import { LoaderFunctionArgs } from "@remix-run/node";
import { PageLayout } from "~/shared/components/layouts/page-layout";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  return { id: params.id };
};

export default function SingleBabyNotificationPage() {
  return (
    <PageLayout
      title="Notifikasi Bayi 123"
      backLink={{ name: "Kembali", href: "/baby-notifications" }}
    >
      Notifikasi 12323
    </PageLayout>
  );
}
