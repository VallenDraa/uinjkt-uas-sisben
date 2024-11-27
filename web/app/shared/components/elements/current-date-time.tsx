import * as React from "react";
import { Badge } from "../ui/badge";
import { getDateAndTime } from "~/shared/utils/formatter";
import { useIsClient } from "~/shared/hooks/use-is-client";
import { Skeleton } from "../ui/skeleton";

export const CurrentDateTime = () => {
  const isClient = useIsClient();
  const [dateTime, setDateTime] = React.useState(() => {
    return getDateAndTime(new Date());
  });

  // Update the time every second
  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setDateTime(getDateAndTime(new Date()));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex gap-2 items-center flex-wrap animate-in">
      <Badge variant="secondary">
        {isClient ? dateTime.time : <Skeleton className="h-4 w-16" />}
      </Badge>
      <Badge variant="secondary">
        {isClient ? dateTime.date : <Skeleton className="h-4 w-16" />}
      </Badge>
    </div>
  );
};
