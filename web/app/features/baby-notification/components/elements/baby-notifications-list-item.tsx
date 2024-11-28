import { Link } from "@remix-run/react";
import { MoveRightIcon } from "lucide-react";
import * as React from "react";
import { BabyNotification } from "~/features/baby-notification/types/baby-notification.types";
import { Badge } from "~/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/shared/components/elements/card";
import { Typography } from "~/shared/components/ui/typography";
import { getDateAndTime } from "~/shared/utils/formatter";
import { Image } from "~/shared/components/ui/image";

export type BabyNotificationsListItemProps = { item: BabyNotification };

export const BabyNotificationsListItem = ({
  item,
}: BabyNotificationsListItemProps) => {
  const dateTime = React.useMemo(
    () => getDateAndTime(new Date(item.created_at)),
    [item.created_at],
  );

  return (
    <Link to={`/baby-notifications/${item.id}`} className="group block w-full">
      <Card className="group-hover:border-primary/50 group-hover:shadow-md group-hover:shadow-primary/10 transition duration-300">
        <CardHeader className="pb-2 justify-between flex-col items-start sm:flex-row gap-2">
          <div className="space-y-4">
            <CardTitle className="capitalize transition-colors duration-300 group-hover:text-primary">
              {item.title}
            </CardTitle>

            <div className="flex gap-2 items-center flex-wrap">
              <Badge variant="default">{dateTime.time}</Badge>
              <Badge variant="default">{dateTime.date}</Badge>
            </div>
          </div>

          <Typography
            variant="lead"
            tag="div"
            className="mt-0 duration-300 text-base md:text-base lg:text-base flex items-center gap-3 justify-end group-hover:text-primary"
          >
            <span>Lihat Notifikasi</span>

            <MoveRightIcon className="size-6" />
          </Typography>
        </CardHeader>

        <CardContent className="flex flex-row items-start gap-2 mt-2 md:mt-0">
          <CardDescription className="grow line-clamp-4 transition-colors duration-300 group-hover:text-primary">
            {item.clarification}
          </CardDescription>

          <Image
            src={item.picture}
            className="rounded shadow h-24 aspect-video object-cover"
          />
        </CardContent>
      </Card>
    </Link>
  );
};
