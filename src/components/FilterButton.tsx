"use client";
import { StateIcon } from "@/components/StateIcon";
import { FC, useCallback } from "react";

export const FilterButton: FC<{
  state: "riven" | "hotad" | "räddad";
  filter?: string;
  onClick: (state?: string) => void;
}> = ({ state, filter, onClick }) => {
  const handleClick = useCallback(
    () => onClick(filter === state ? undefined : state),
    [state, filter],
  );
  return (
    <button
      className="flex items-center gap-2 font-bold uppercase"
      onClick={handleClick}
    >
      <StateIcon state={state} />
      {state}
    </button>
  );
};
