import * as React from "react";
import { Badge } from "../ui/badge";
import { formatTime } from "~/shared/utils/formatter";

export const CurrentDateTime = () => {
  const [dateTime, setDateTime] = React.useState(() => {
    const currentDate = new Date();

    return {
      date: currentDate.toLocaleDateString(),
      time: formatTime(currentDate),
    };
  });

  // Update the time every second
  React.useEffect(() => {
    const intervalId = setInterval(() => {
      const currentDate = new Date();

      setDateTime({
        date: currentDate.toLocaleDateString(),
        time: formatTime(currentDate),
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex gap-2 items-center flex-wrap">
      <Badge variant="secondary">{dateTime.time}</Badge>
      <Badge variant="secondary">{dateTime.date}</Badge>
    </div>
  );
};
