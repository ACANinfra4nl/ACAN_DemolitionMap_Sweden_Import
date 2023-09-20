import classNames from "classnames";
import { FC } from "react";

export const StateIcon: FC<{ state: string }> = ({ state }) => (
  <div
    className={classNames(
      "h-6 w-6 rounded-full",
      state == "riven"
        ? "bg-red-600"
        : state == "hotad"
        ? "bg-yellow-400"
        : "bg-green-500",
    )}
    aria-label={state}
  ></div>
);
