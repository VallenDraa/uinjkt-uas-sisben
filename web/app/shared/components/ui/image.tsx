import { ImageIcon } from "lucide-react";
import * as React from "react";
import { cn } from "~/shared/utils/shadcn";

export type ImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  showPlaceholder?: boolean;
};

export const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  ({ showPlaceholder, src, className, alt, ...props }, ref) => {
    const [isError, setIsError] = React.useState(false);

    React.useEffect(() => {
      setIsError(false);
    }, [src]);

    return isError || showPlaceholder ? (
      <div
        ref={ref}
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
        ref={ref}
        onError={() => setIsError(true)}
      />
    );
  },
);

Image.displayName = "Image";
