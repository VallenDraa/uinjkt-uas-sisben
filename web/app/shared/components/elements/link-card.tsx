import { Link } from "@remix-run/react";
import { LucideIcon, MoveRightIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/shared/components/elements/card";
import { Typography } from "~/shared/components/ui/typography";

export type LinkCardProps = {
  name: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

export const LinkCard = ({
  href,
  icon: Icon,
  name,
  description,
}: LinkCardProps) => {
  return (
    <Link to={href} className="group inline">
      <Card className="relative group-hover:border-primary/50 group-hover:shadow-md group-hover:shadow-primary/10 transition duration-300 group-hover:-translate-y-1 group-hover:scale-[100.5%]">
        <CardHeader className="relative z-10">
          <CardTitle className="transition-colors duration-300 group-hover:text-primary">
            {name}
          </CardTitle>
          <CardDescription className="transition-colors duration-300 group-hover:text-primary">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="text-right">
          <Icon
            strokeWidth={1.5}
            className="absolute top-6 right-6 opacity-10 size-24 group-hover:text-primary transition-colors duration-300"
          />

          <Typography
            variant="lead"
            tag="div"
            className="duration-300 text-base md:text-base lg:text-base flex items-center gap-3 justify-end group-hover:text-primary"
          >
            <span>{`Lihat ${name.toLowerCase()}`}</span>

            <MoveRightIcon className="size-6" />
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
};
