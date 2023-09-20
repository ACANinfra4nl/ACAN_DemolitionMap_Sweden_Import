import { FC, ReactNode } from "react";
import { CloseButton } from "./CloseButton";
import { Carousel } from "./Carousel";
import { StateIcon } from "./StateIcon";

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
  <div className="grid grid-rows-[auto_1fr]">
    <div className="z-10 col-start-1 row-start-1 ml-6 mt-6">
      <CloseButton onClick={onClose} />
    </div>

    {properties.images && properties.images.map && (
      <div className="col-start-1 row-span-2 row-start-1">
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

    <div className="p-4">
      <h2 className="mb-4">
        <span className="text-2xl font-bold">{properties.address}</span>
        <br />
        <span className="text-lg font-bold uppercase">
          {properties.postcode} {properties.city}
        </span>
      </h2>
      <div className="grid grid-cols-2 gap-2">
        <div className="mb-4 text-lg font-bold capitalize">
          {properties.category}
        </div>
        <div className="flex justify-end gap-2 text-lg font-bold uppercase">
          <StateIcon state={properties.state} />
          {properties.state}
        </div>
        {properties.architect && (
          <>
            <div>Arkitekt</div>
            <div>{properties.architect}</div>
          </>
        )}
        {typeof properties.size === "number" && properties.size > 0 && (
          <Detail
            label="Storlek"
            value={
              <>
                {properties.size}m<sup>2</sup>
              </>
            }
          />
        )}
        {properties.blockName && (
          <Detail label="Kvartersnamn" value={properties.blockName} />
        )}
        {properties.propertyOwner && (
          <Detail label="Fastighetsägare" value={properties.propertyOwner} />
        )}
        {typeof properties.boundCO2 === "number" && properties.boundCO2 > 0 && (
          <Detail label="Bunden CO²" value={<>{properties.boundCO2} ton</>} />
        )}
        {properties.buildYear > 0 && (
          <Detail label="Byggår" value={properties.buildYear} />
        )}
        {properties.demolitionYear > 0 && (
          <Detail label="Rivningsår" value={properties.demolitionYear} />
        )}
        {properties.description && (
          <Detail label="Arkitektur" value={properties.description} />
        )}
        {properties.demolitionCause && (
          <Detail label="Rivningsorsak" value={properties.demolitionCause} />
        )}
      </div>
    </div>

    <details>
      <summary>Visa kod</summary>
      <pre>{JSON.stringify(properties, null, 2)}</pre>
    </details>
  </div>
);
