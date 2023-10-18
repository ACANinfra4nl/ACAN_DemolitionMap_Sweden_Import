import { FC } from "react";
import Link from "next/link";
import { BuildingHeading } from "./BuildingHeading";
import { BuildingImage } from "./BuildingImage";
import { buildingToQueryParams } from "../lib/buildingToQueryParams";

export const LatestSection: FC<{ buildings: FeatureBuilding[] }> = ({
  buildings,
}) => {
  return (
    <section className="scrollbar-hide mb-24 mt-column flex snap-x snap-mandatory flex-nowrap items-baseline overflow-scroll">
      {buildings.map((building) => (
        <Link
          href={`/lista?${buildingToQueryParams(building)}`}
          className="flex shrink-0 grow-0 basis-10/12 snap-start flex-col gap-2 px-5 sm:basis-8/12 md:basis-5/12"
          key={building._id}
        >
          <BuildingImage images={building.images} state={building.state} />
          <BuildingHeading building={building} showYear />
        </Link>
      ))}
      <div className="flex shrink-0 grow-0 basis-4/5 snap-start items-center justify-center self-stretch md:basis-3/5 lg:basis-2/5">
        <Link href="/lista" className="acan-text-menu">
          <span className="underline">Visa alla</span> &rarr;
        </Link>
      </div>
    </section>
  );
};
