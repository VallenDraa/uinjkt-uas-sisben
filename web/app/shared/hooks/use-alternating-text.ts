import React from "react";

export type UseAlternatingTextOptions = {
  textList: string[];
  interval?: number;
  firstIndex?: number;
  isActive?: boolean;
};

export const useAlternatingText = ({
  textList,
  firstIndex = 0,
  interval = 1000,
  isActive = true,
}: UseAlternatingTextOptions) => {
  const [textIndex, setTextIndex] = React.useState(firstIndex);

  React.useEffect(() => {
    const indexInterval = setInterval(() => {
      setTextIndex(prevIndex => {
        return prevIndex === textList.length - 1 ? 0 : prevIndex + 1;
      });
    }, interval);

    if (isActive === false) {
      return clearInterval(indexInterval);
    }

    return () => {
      clearInterval(indexInterval);
    };
  }, [textList.length, interval, isActive]);

  return textList[textIndex];
};
