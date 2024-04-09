"use client";
import { StateIcon } from "@/components/StateIcon";
import classNames from "classnames";
import { FC, useCallback } from "react";

export const FilterButton: FC<{
  state: "riven" | "hotad" | "räddad";
  filter?: string;
  onClick: (state?: string) => void;
  label: string;
}> = ({ state, filter, onClick, label }) => {
  const handleClick = useCallback(
    () => onClick(filter === state ? undefined : state),
    [state, filter],
  );
  return (
    <button
      className={classNames(
        "acan-text-menu flex items-center gap-2 outline-none hover:text-acan-blue hover:opacity-100 focus-visible:text-acan-blue focus-visible:opacity-100",
        filter && state !== filter && "opacity-50",
      )}
      onClick={handleClick}
    >
      <StateIcon state={state} />
      {label}
    </button>
  );
};
