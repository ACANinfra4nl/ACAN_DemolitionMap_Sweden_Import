import { FC, ReactNode } from "react";
import { CloseButton } from "./CloseButton";
import { Carousel } from "./Carousel";
import { StateIcon } from "./StateIcon";
import { BuildingHeading } from "./BuildingHeading";
import { DetailsTable } from "./DetailsTable";

const Detail: FC<{ label: string; value: string | number | ReactNode }> = ({
  label,
  value,
}) => (
  <>
    <div>{label}</div>
    <div className="text-right font-bold">{value}</div>
  </>
);

interface DetailsProps {
  properties: FeatureBuilding;
  onClose: () => void;
}

export const DetailsPanel: FC<DetailsProps> = ({ properties, onClose }) => (
  <div className="grid grid-rows-[auto_auto_1fr] p-5">
    <div className="z-10 col-start-1 row-start-1 ml-6 mt-6">
      <CloseButton onClick={onClose} />
    </div>

    {properties.images && properties.images.map && (
      <div className="col-start-1 row-span-2 row-start-1 mb-2">
        <Carousel>
          {properties.images.map((image) => (
            <img
              key={image}
              src={image}
              role="presentation"
              className="aspect-video w-full snap-start object-cover"
            />
          ))}
        </Carousel>
      </div>
    )}

    <div>
      <BuildingHeading building={properties} />
      <DetailsTable building={properties} />
      <div className="text-body prose">
        {properties.description && <p>{properties.description}</p>}
        {properties.demolitionCause && <p>{properties.demolitionCause}</p>}
      </div>
    </div>
  </div>
);
