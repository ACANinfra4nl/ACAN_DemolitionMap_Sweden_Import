import { FC } from "react";
import { StateIcon } from "./StateIcon";
import classNames from "classnames";

export const BuildingHeading: FC<{
  building: FeatureBuilding;
  showYear?: boolean;
  list?: boolean;
  dictStates: States;
}> = ({ building, showYear, list, dictStates }) => {
  return (
    <div
      className={classNames(
        "flex w-full items-start justify-between gap-2",
        list ? "text-list" : "acan-text-menu",
      )}
    >
      <div
        className="min-w-0 flex-grow overflow-hidden text-ellipsis whitespace-nowrap"
        title={`${building.name || building.propertyDesignation}\n${
          building.address
        }\n${building.city}`}
      >
        {Boolean(building.name || building.propertyDesignation) && (
          <>
            {building.name || building.propertyDesignation}
            <br />
          </>
        )}
        {building.address}
        <br />
        {building.city}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <StateIcon state={building.state} dictStates={dictStates} />
        {showYear && (
          <span>
            {building.state}{" "}
            {building.state === "riven" ? building.demolitionYear : null}
          </span>
        )}
      </div>
    </div>
  );
};
