import { capitalize } from "@/lib/capitalize";
import type { FC } from "react";

const TableRow: FC<{
  value: string | number | undefined;
  unit?: string;
  label: string;
  capitalize?: boolean;
}> = ({ value, unit, label }) =>
  value ? (
    <tr className="border-b border-current first-letter:uppercase first:border-t">
      <td className="w-1/2 py-1 first-letter:uppercase">{label}</td>
      <td className="py-1">
        {value} {unit}
      </td>
    </tr>
  ) : null;

export const DetailsTable: FC<{
  building: FeatureBuilding;
  content: Building;
}> = ({ building, content }) => (
  <table className="mb-9 mt-7 w-full text-body first-letter:uppercase">
    <tbody>
      <TableRow value={building.architect} label={content.architect} />
      <TableRow value={building.size} unit="m²" label={content.size} />
      <TableRow value={building.blockName} label={content.blockName} />
      <TableRow value={building.propertyOwner} label={content.propertyOwner} />
      <TableRow
        value={building.boundCO2}
        unit={content.boundCO2.unit}
        label={content.boundCO2.label}
      />
      <TableRow value={building.buildYear} label={content.buildYear} />
      <TableRow
        value={building.demolitionYear}
        label={content.demolitionYear}
      />
      <TableRow
        value={capitalize(building.category)}
        label={content.category}
      />
    </tbody>
  </table>
);
