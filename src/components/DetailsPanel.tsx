import { FC } from "react";

interface DetailsProps {
  name: string;
  description: string;
  onClose: () => void;
}

export const DetailsPanel: FC<DetailsProps> = ({
  name,
  description,
  onClose,
}) => (
  <div className="bg-white p-4">
    <button onClick={onClose}>&times;</button>
    <h2 className="font-bold">{name}</h2>
    <p>{description}</p>
  </div>
);
