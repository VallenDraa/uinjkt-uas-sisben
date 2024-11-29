import { ImageIcon } from "lucide-react";
import * as React from "react";
import { cn } from "~/shared/utils/shadcn";

export type ImageProps = React.ImgHTMLAttributes<HTMLImageElement>;

export const Image = ({ src, className, alt, ...props }: ImageProps) => {
  const [isError, setIsError] = React.useState(false);

  React.useEffect(() => {
    setIsError(false);
  }, [src]);

  return isError ? (
    <div
      className={cn(
        "aspect-video border border-border rounded-lg flex items-center justify-center bg-secondary",
        className,
      )}
    >
      <ImageIcon />
    </div>
  ) : (
    <img
      {...props}
      alt={alt}
      className={cn("animate-in fade-in", className)}
      src={src}
      onError={() => setIsError(true)}
    />
  );
};
