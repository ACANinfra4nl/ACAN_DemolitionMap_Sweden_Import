import classNames from "classnames";
import { FC } from "react";

export const StateIcon: FC<{ state: string }> = ({ state }) => (
  <div
    className={classNames(
      "w-6 h-6 rounded-full",
      state == "riven"
        ? "bg-red-600"
        : state == "hoted"
        ? "bg-yellow-400"
        : "bg-green-500"
    )}
    aria-label={state}
  ></div>
);
