import { FC } from "react";
import { CloseButton } from "./CloseButton";
import { Carousel } from "./Carousel";

interface DetailsProps {
  properties: FeatureBuilding;
  onClose: () => void;
}

export const DetailsPanel: FC<DetailsProps> = ({ properties, onClose }) => (
  <div className="bg-white p-4">
    <div className="text-right mb-4">
      <CloseButton onClick={onClose} />
    </div>
    <h2 className="text-lg">
      {properties.address}
      <br />
      {properties.postcode} {properties.city}
    </h2>

    {properties.images && properties.images.map && (
      <Carousel>
        {properties.images.map((image) => (
          <img
            key={image}
            src={image}
            role="presentation"
            className="w-full aspect-video object-cover mb-4 scroll-m-0 snap-start"
          />
        ))}
      </Carousel>
    )}
    <p className="mb-4">
      <span className="font-bold">Kategori</span>{" "}
      <span className="capitalize">{properties.category}</span>
    </p>
    <p className="mb-4">
      <span className="font-bold">Status</span>{" "}
      <span className="capitalize">{properties.state}</span>
    </p>
    {properties.blockName && (
      <p className="mb-4">
        <span className="font-bold">Kvartersnamn</span> {properties.blockName}
      </p>
    )}
    <p className="mb-4">
      <span className="font-bold">Byggår</span> {properties.buildYear}
    </p>
    <p className="mb-4">
      <span className="font-bold">Rivningsår</span> {properties.demolitionYear}
    </p>
    <p className="mb-4">
      <span className="font-bold">Arkitektur</span> {properties.description}
    </p>
    <p className="mb-4">
      <span className="font-bold">Rivningsorsak</span>{" "}
      {properties.demolitionCause}
    </p>
    <details>
      <summary>Visa kod</summary>
      <pre>{JSON.stringify(properties, null, 2)}</pre>
    </details>
  </div>
);
