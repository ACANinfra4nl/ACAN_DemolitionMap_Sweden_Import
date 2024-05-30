import classNames from "classnames";
import { FC, PropsWithChildren } from "react";

export const SortButton: FC<
  PropsWithChildren<{
    sortKey: keyof FeatureBuilding;
    sortBy: string;
    sortDesc?: boolean;
    onClick: () => void;
  }>
> = ({ sortKey, sortBy, sortDesc, onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className={classNames(
        "whitespace-nowrap uppercase outline-none hover:text-acan-blue focus-visible:text-acan-blue",
        sortBy === sortKey && "underline",
      )}
    >
      {children}
      <SortArrow descending={sortBy === sortKey ? sortDesc : undefined} />
    </button>
  );
};

const SortArrow: FC<{ descending?: boolean }> = ({ descending }) => (
  <span className="inline-block w-4 text-center">
    {typeof descending === "boolean" && (descending ? "↓" : "↑")}
  </span>
);
