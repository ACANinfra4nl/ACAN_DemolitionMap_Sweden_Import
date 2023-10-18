"use client";
import { FC, MouseEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { BuildingHeading } from "./BuildingHeading";
import { BuildingImage } from "./BuildingImage";
import { buildingToQueryParams } from "../lib/buildingToQueryParams";
import { createPortal } from "react-dom";
import { Transition } from "@headlessui/react";
import { DetailsPanel } from "./DetailsPanel";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const LatestSection: FC<{ buildings: FeatureBuilding[] }> = ({
  buildings,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedId, setSelectedId] = useState(searchParams.get("view"));
  const [showDetails, setShowDetails] = useState(!!selectedId);
  const [renderPortal, setRenderPortal] = useState(false);
  const selectedBuilding = selectedId
    ? buildings.find((b) => b._id === selectedId)
    : undefined;

  useEffect(() => {
    // this is a workaround to avoid hydration errors
    setRenderPortal(true);
  }, []);

  const handleSelectBuilding = useCallback(
    (e: MouseEvent<HTMLAnchorElement>, building: FeatureBuilding) => {
      e.preventDefault();
      e.nativeEvent.stopImmediatePropagation();
      router.push(`/?${buildingToQueryParams(building)}`, { scroll: false });
      setShowDetails(true);
      setSelectedId(building._id);
    },
    [],
  );
  const handleCloseDetails = useCallback(() => {
    router.push(pathname, { scroll: false });
    setShowDetails(false);
    setTimeout(setSelectedId, 300, null);
  }, []);

  return (
    <section className="scrollbar-hide mb-24 mt-column flex snap-x snap-mandatory flex-nowrap items-baseline overflow-scroll">
      {buildings.map((building) => (
        <Link
          href={`/?${buildingToQueryParams(building)}`}
          onClick={(e) => handleSelectBuilding(e, building)}
          className="flex shrink-0 grow-0 basis-10/12 snap-start flex-col gap-2 px-5 sm:basis-8/12 md:basis-5/12"
          key={building._id}
        >
          <BuildingImage images={building.images} state={building.state} />
          <BuildingHeading building={building} showYear />
        </Link>
      ))}
      <div className="flex shrink-0 grow-0 basis-4/5 snap-start items-center justify-center self-stretch md:basis-3/5 lg:basis-2/5">
        <Link
          href="/lista"
          className="acan-text-menu"
          onClick={(e) => e.nativeEvent.stopImmediatePropagation()}
        >
          <span className="underline">Visa alla</span> &rarr;
        </Link>
      </div>
      {renderPortal &&
        createPortal(
          <Transition
            show={showDetails}
            className="fixed bottom-0 left-0 top-0 z-10 grid w-full bg-white sm:w-1/2 md:w-5/12"
            enter="transition-transform duration-300 ease-out"
            enterFrom="-translate-x-full"
            enterTo="translate-none"
            leave="transition-transform duration-300 ease-in delay-[10ms]"
            leaveFrom="translate-none"
            leaveTo="-translate-x-full"
          >
            {selectedBuilding && (
              <DetailsPanel
                properties={selectedBuilding}
                onClose={handleCloseDetails}
              />
            )}
          </Transition>,
          document.getElementById("portal")!,
        )}
    </section>
  );
};
