import classNames from "classnames";
import { FC, useCallback } from "react";

interface FilterButtonProps {
  imgSrc: string;
  state: string;
  selected: boolean;
  onClick: (state: string) => void;
}

export const FilterButton: FC<FilterButtonProps> = ({
  imgSrc,
  selected,
  state,
  onClick,
}) => {
  const handleClick = useCallback(() => onClick(state), [state]);
  return (
    <button
      className={classNames(
        "flex items-center gap-2 px-2 py-1",
        selected && "bg-black text-white",
      )}
      onClick={handleClick}
    >
      <img src={imgSrc} role="presentation" className="h-4 w-4" />
      {state}
    </button>
  );
};
