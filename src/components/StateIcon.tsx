import { capitalize } from "@/lib/capitalize";
import classNames from "classnames";
import { FC } from "react";

export const StateIcon: FC<{ state: string; dictStates: States }> = ({
  state,
  dictStates,
}) => (
  <div
    className={classNames(
      "h-4 w-4 shrink-0 rounded-full",
      state === dictStates.demolished
        ? "bg-demolished"
        : state === dictStates.threatened
        ? "bg-threatened"
        : state === dictStates.saved
        ? "bg-saved"
        : "bg-gray-unknown",
    )}
    aria-label={state}
    title={state}
  ></div>
);
