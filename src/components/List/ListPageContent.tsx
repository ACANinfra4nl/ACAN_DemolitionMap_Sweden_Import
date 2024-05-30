"use client";
import { DetailsMap } from "@/components/DetailsMap";
import { DetailsPanel } from "@/components/DetailsPanel";
import { Navigation } from "@/components/Navigation";
import classNames from "classnames";
import {
  FC,
  MouseEvent,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Transition } from "@headlessui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BuildingImage } from "@/components/BuildingImage";
import { buildingToQueryParams } from "@/lib/buildingToQueryParams";
import { BuildingHeading } from "@/components/BuildingHeading";
import { Feature, Point } from "geojson";
import { ListFilter } from "./ListFilter";
import { SORTERS } from "./sorting";

const matchesIgnoreCase = (haystack: string | undefined, needle: string) =>
  haystack?.toLowerCase().includes(needle.toLowerCase());

const filterBuildings = (filters: string) => (feature: BuildingFeature) =>
  filters
    .split(/\s+/)
    .every(
      (filter) =>
        matchesIgnoreCase(feature.properties.name, filter) ||
        matchesIgnoreCase(feature.properties.description, filter) ||
        matchesIgnoreCase(feature.properties.demolitionCause, filter) ||
        matchesIgnoreCase(feature.properties.address, filter) ||
        matchesIgnoreCase(feature.properties.city, filter) ||
        matchesIgnoreCase(feature.properties.architect, filter) ||
        matchesIgnoreCase(feature.properties.propertyOwner, filter) ||
        matchesIgnoreCase(feature.properties.propertyDesignation, filter) ||
        matchesIgnoreCase(feature.properties.blockName, filter) ||
        matchesIgnoreCase(feature.properties.state, filter) ||
        matchesIgnoreCase(feature.properties.category, filter),
    );

export const ListPageContent: FC<{
  feedbackEmail?: string;
  buildings: {
    type: "FeatureCollection";
    features: Feature<Point, FeatureBuilding>[];
  };
  dict: Dictionary;
}> = ({ feedbackEmail, buildings, dict }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("view");
  const [filter, setFilter] = useState("");
  const [stateFilter, setStateFilter] = useState<string>();
  const [hasSelectedBuilding, setHasSelectedBuilding] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<FeatureBuilding>();
  const [sortBy, setSortBy] = useState<keyof typeof SORTERS>("_createdAt");
  const [sortDesc, setSortDesc] = useState(true);

  useEffect(() => {
    if (selectedId) {
      setSelectedBuilding(
        buildings.features.find((f) => f.properties._id === selectedId)
          ?.properties,
      );
      setHasSelectedBuilding(true);
    } else {
      setHasSelectedBuilding(false);
    }
  }, [selectedId]);

  const handleSelectBuilding = useCallback(
    (building: FeatureBuilding, e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      setSelectedBuilding(building);
      setHasSelectedBuilding(true);
      router.push(`${pathname}?${buildingToQueryParams(building)}`, {
        scroll: false,
      });
    },
    [router, pathname],
  );

  const handleClearSelection = useCallback(() => {
    setHasSelectedBuilding(false);
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  let rows =
    buildings?.features
      .filter(
        (b) =>
          typeof stateFilter === "undefined" ||
          b.properties.state === stateFilter,
      )
      .filter(filterBuildings(filter))
      .sort(SORTERS[sortBy](sortDesc)) ?? [];

  return (
    <>
      <div className="min-h-screen">
        <div className="min-h-[1px]"></div>
        <header className="sticky top-0 z-10">
          <Navigation dict={dict} />
          <ListFilter
            stateFilter={stateFilter}
            setStateFilter={setStateFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortDesc={sortDesc}
            setSortDesc={setSortDesc}
            setFilter={setFilter}
            dict={dict}
          />
        </header>
        <main className="grid grid-cols-1 grid-rows-[auto_1fr]">
          <Transition
            show={hasSelectedBuilding}
            className="fixed bottom-0 left-0 right-0 top-0 z-20 grid grid-cols-12 grid-rows-1"
          >
            <Transition.Child
              className="col-span-12 row-start-1 overflow-scroll scroll-smooth bg-white sm:col-span-6 sm:col-start-1 md:col-span-5 md:col-start-1"
              enter="transition-transform duration-300 ease-out"
              enterFrom="-translate-x-full"
              enterTo="translate-none"
              leave="transition-transform ease-in duration-300"
              leaveFrom="translate-none"
              leaveTo="-translate-x-full"
            >
              {selectedBuilding && (
                <DetailsPanel
                  feedbackEmail={feedbackEmail}
                  properties={selectedBuilding}
                  onClose={handleClearSelection}
                  dict={dict}
                />
              )}
            </Transition.Child>
            <Transition.Child
              className="row-start-1 hidden bg-black sm:col-span-6 sm:col-start-7 sm:block md:col-span-7 md:col-start-6"
              enter="transition-transform ease-out duration-300"
              enterFrom="translate-x-full"
              enterTo="translate-none"
              leave="transition-transform ease-in duration-300"
              leaveFrom="translate-none"
              leaveTo="translate-x-full"
            >
              {selectedBuilding && <DetailsMap building={selectedBuilding} />}
            </Transition.Child>
          </Transition>

          <div className="col-start-1 row-start-2 px-5 pb-20 pt-5">
            <ul className="grid auto-rows-fr grid-cols-1 items-start gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {rows.map((building) => (
                <li key={building.properties._id}>
                  <a
                    href={`${pathname}?${buildingToQueryParams(
                      building.properties,
                    )}`}
                    onClick={(e) =>
                      handleSelectBuilding(building.properties, e)
                    }
                    className="hover:acan-blue flex w-full flex-col gap-2 text-left text-gray-list focus-visible:text-acan-blue"
                  >
                    <BuildingImage
                      images={building.properties.images}
                      state={building.properties.state}
                      sizes="(min-width: 1600px) 16vw, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 49vw, 99vw"
                    />
                    <BuildingHeading
                      building={building.properties}
                      list
                      dictStates={dict.states}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    </>
  );
};
