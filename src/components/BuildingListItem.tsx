import { FC } from "react";
import { StateIcon } from "./StateIcon";

export const BuildingListItem: FC<{ building: FeatureBuilding }> = ({
  building,
}) => (
  <div className="flex w-full flex-col gap-2">
    <div className="relative aspect-[3/2] w-full">
      <div className="absolute left-2 top-2"></div>
      {building.images && building.images.length > 0 ? (
        <img
          src={building.images[0]}
          className="aspect-[3/2] w-full object-cover"
        />
      ) : (
        <div className="flex aspect-[3/2] w-full items-center justify-center bg-gray-100 object-cover text-gray-300">
          Bild saknas
        </div>
      )}
    </div>
    <div className="flex gap-2">
      <div>
        {building.address}
        <br />
        {building.postcode} {building.city}
      </div>
      <StateIcon state={building.state} />
    </div>
  </div>
);
