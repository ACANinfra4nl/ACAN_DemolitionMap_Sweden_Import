import { FC } from "react";
import { CloseButton } from "./CloseButton";

interface DetailsProps {
  image?: string;
  name: string;
  description: string;
  onClose: () => void;
}

export const DetailsPanel: FC<DetailsProps> = ({
  image,
  name,
  description,
  onClose,
}) => (
  <div className="bg-white p-4">
    <div className="text-right mb-4">
      <CloseButton onClick={onClose} />
    </div>
    {image && (
      <img
        src={image}
        role="presentation"
        className="w-full aspect-video object-cover block mb-4"
      />
    )}
    <h2 className="font-bold mb-4">{name}</h2>
    <p>{description}</p>
  </div>
);
