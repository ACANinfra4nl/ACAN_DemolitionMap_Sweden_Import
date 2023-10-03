import classNames from "classnames";
import { FC } from "react";

export const StateIcon: FC<{ state: string }> = ({ state }) => (
  <div
    className={classNames(
      "h-4 w-4 shrink-0 rounded-full",
      state == "riven"
        ? "bg-demolished"
        : state == "hotad"
        ? "bg-threatened"
        : "bg-saved",
    )}
    aria-label={state}
  ></div>
);
