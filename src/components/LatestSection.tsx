import { FC } from "react";
import Link from "next/link";
import { BuildingHeading } from "./BuildingHeading";

export const LatestSection: FC<{ buildings: FeatureBuilding[] }> = ({
  buildings,
}) => {
  return (
    <section className="scrollbar-hide mt-column mb-24 flex snap-x snap-mandatory flex-nowrap items-baseline overflow-scroll">
      {buildings.map((building) => (
        <div
          className="flex shrink-0 grow-0 basis-4/5 snap-start flex-col gap-2 px-5 md:basis-3/5 lg:basis-2/5"
          key={building._id}
        >
          <div>
            {building.images && building.images.length > 0 ? (
              <img
                src={building.images[0]}
                className="block w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="float-left flex aspect-square w-full items-center justify-center bg-gray-100 text-gray-300">
                Bild saknas
              </div>
            )}
          </div>
          <BuildingHeading building={building} showYear />
        </div>
      ))}
      <div className="flex shrink-0 grow-0 basis-4/5 snap-start items-center justify-center self-stretch md:basis-3/5 lg:basis-2/5">
        <Link href="/lista" className="text-xl font-bold">
          <span className="underline">Visa alla</span> &rarr;
        </Link>
      </div>
    </section>
  );
};
