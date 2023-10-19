import { FC } from "react";
import { StateIcon } from "./StateIcon";

export const BuildingHeading: FC<{
  building: FeatureBuilding;
  showYear?: boolean;
}> = ({ building, showYear }) => {
  return (
    <div className="acan-text-menu flex w-full items-start justify-between gap-2">
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
        <StateIcon state={building.state} />
        <span>
          {building.state} {showYear ? building.demolitionYear : null}
        </span>
      </div>
    </div>
  );
};
