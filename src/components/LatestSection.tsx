import { FC } from "react";
import { BuildingListItem } from "./BuildingListItem";
import { StateIcon } from "./StateIcon";
import Link from "next/link";

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
          <div className="text-menu-s sm:text-menu flex items-start justify-between gap-2">
            <div>
              {building.address}
              <br />
              {building.postcode} {building.city}
            </div>
            <div className="flex shrink-0 items-center gap-2 uppercase">
              <StateIcon state={building.state} />
              <span>
                {building.state} {building.demolitionYear}
              </span>
            </div>
          </div>
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
