import { FC } from "react";
import { StateIcon } from "./StateIcon";

export const BuildingHeading: FC<{
  building: FeatureBuilding;
  showYear?: boolean;
}> = ({ building, showYear }) => {
  return (
    <div className="acan-text-menu flex w-full items-start justify-between gap-2">
      <div className="flex-grow">
        {(building.name || building.propertyDesignation) && (
          <div>{building.name ?? building.propertyDesignation}</div>
        )}
        <div>
          {building.address}
          <br />
          {building.postcode} {building.city}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <StateIcon state={building.state} />
        <span>
          {building.state} {showYear ? building.demolitionYear : null}
        </span>
      </div>
    </div>
  );
};
