import { capitalize } from "@/lib/capitalize";
import type { FC } from "react";

const TableRow: FC<{
  value: string | number | undefined;
  unit?: string;
  label: string;
  capitalize?: boolean;
}> = ({ value, unit, label }) =>
  value ? (
    <tr className="border-b border-current first:border-t">
      <td className="w-1/2 py-1">{label}</td>
      <td className="py-1">
        {value} {unit}
      </td>
    </tr>
  ) : null;

export const DetailsTable: FC<{ building: FeatureBuilding }> = ({
  building,
}) => (
  <table className="text-body mb-9 mt-7 w-full">
    <TableRow value={building.architect} label="Arkitekt" />
    <TableRow value={building.size} unit="m²" label="Storlek" />
    <TableRow value={building.blockName} label="Kvarter" />
    <TableRow value={building.propertyOwner} label="Fastighetsägare" />
    <TableRow value={building.boundCO2} unit="ton" label="Inbunden CO²" />
    <TableRow value={building.buildYear} label="Byggår" />
    <TableRow value={building.demolitionYear} label="Rivningsår" />
    <TableRow value={capitalize(building.category)} label="Kategori" />
  </table>
);
