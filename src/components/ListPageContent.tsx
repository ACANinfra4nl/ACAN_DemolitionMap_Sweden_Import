"use client";
import { DetailsMap } from "@/components/DetailsMap";
import { DetailsPanel } from "@/components/DetailsPanel";
import { Navigation } from "@/components/Navigation";
import classNames from "classnames";
import {
  ChangeEventHandler,
  FC,
  MouseEvent,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
import { FilterButton } from "@/components/FilterButton";
import { Transition } from "@headlessui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BuildingImage } from "@/components/BuildingImage";
import { buildingToQueryParams } from "@/lib/buildingToQueryParams";
import { BuildingHeading } from "@/components/BuildingHeading";
import { useBuildings } from "@/app/hooks/useBuildings";
import { StateIcon } from "./StateIcon";
import { ListSkeleton } from "./ListSkeleton";

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

type BuildingSorter = (
  descending: boolean,
) => (a: BuildingFeature, b: BuildingFeature) => number;
const buildYearSorter: BuildingSorter = (desc) => (a, b) =>
  (a.properties.buildYear - b.properties.buildYear) * (desc ? -1 : 1);
const demolitionYearSorter: BuildingSorter = (desc) => (a, b) =>
  a.properties.demolitionYear && b.properties.demolitionYear
    ? (a.properties.demolitionYear - b.properties.demolitionYear) *
      (desc ? -1 : 1)
    : a.properties.demolitionYear
    ? -1
    : 1;
const addressSorter: BuildingSorter = (desc) => (a, b) =>
  a.properties.address &&
  b.properties.address &&
  a.properties.address < b.properties.address
    ? -1
    : 1;

const SORTERS = {
  buildYear: buildYearSorter,
  demolitionYear: demolitionYearSorter,
  address: addressSorter,
};

const SortArrow: FC<{ descending?: boolean }> = ({ descending }) => (
  <span className="inline-block w-4 text-center">
    {typeof descending === "boolean" && (descending ? "↓" : "↑")}
  </span>
);

export const ListPageContent = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("view");
  const { buildings, loading } = useBuildings();
  const [filter, setFilter] = useState("");
  const [stateFilter, setStateFilter] = useState<string>();
  const [hasSelectedBuilding, setHasSelectedBuilding] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<FeatureBuilding>();
  const [sortBy, setSortBy] = useState<keyof typeof SORTERS>("buildYear");
  const [sortDesc, setSortDesc] = useState(false);

  useEffect(() => {
    if (loading || !buildings) return;

    if (selectedId) {
      setSelectedBuilding(
        buildings.features.find((f) => f.properties._id === selectedId)
          ?.properties,
      );
      setHasSelectedBuilding(true);
    } else {
      setHasSelectedBuilding(false);
    }
  }, [loading, buildings?.features, selectedId]);

  const handleFilterChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const value = e.target.value;
      setFilter(value.trim());
    },
    [],
  );

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

  const handleSortBy = (key: keyof typeof SORTERS) => () => {
    if (sortBy === key) setSortDesc((old) => !old);
    else setSortDesc(false);
    setSortBy(key);
  };

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
      <div className="h-screen">
        <div className="min-h-[1px]"></div>
        <header className="fixed left-0 right-0 top-0 z-10">
          <Navigation />
        </header>
        <main className="mt-header-s grid grid-cols-1 grid-rows-[auto_1fr] pt-[4.125rem] sm:mt-header sm:pt-[4.75rem] md:pt-10">
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
                  properties={selectedBuilding}
                  onClose={handleClearSelection}
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
          <div className="acan-text-menu fixed top-header-s z-10 grid w-full grid-cols-[auto_1fr_auto] gap-x-10 gap-y-3 px-5 sm:top-header">
            <div className="col-span-3 flex gap-2 md:col-span-1">
              <FilterButton
                state="riven"
                filter={stateFilter}
                onClick={setStateFilter}
              />
              <FilterButton
                state="hotad"
                filter={stateFilter}
                onClick={setStateFilter}
              />
              <FilterButton
                state="räddad"
                filter={stateFilter}
                onClick={setStateFilter}
              />
            </div>
            <div className="relative col-span-2 items-center text-menu-s sm:text-menu md:col-span-1 md:col-start-2">
              <input
                aria-label="Filtrera"
                id="filter"
                type="text"
                name="filter"
                className="peer w-full border-b border-current bg-transparent pl-6 uppercase outline-none placeholder:uppercase placeholder:text-current focus:border-b-acan-blue"
                onChange={handleFilterChange}
                placeholder="Sök"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                strokeWidth={2}
                className="absolute bottom-1 left-0 stroke-black peer-focus:stroke-acan-blue"
              >
                <circle cx="6.5" cy="6.5" r="5.5" />
                <path d="m10 10 5 5" />
              </svg>
            </div>
            <div className="col-start-3 flex items-center gap-2 text-menu-s sm:text-menu">
              {/* <SortButton
                    sortKey="address"
                    sortBy={sortBy}
                    sortDesc={sortDesc}
                    onClick={handleSortBy("address")}
                  >
                    A &ndash; Ö
                  </SortButton> */}
              <SortButton
                sortKey="buildYear"
                sortBy={sortBy}
                sortDesc={sortDesc}
                onClick={handleSortBy("buildYear")}
              >
                Byggår
              </SortButton>
              <SortButton
                sortKey="demolitionYear"
                sortBy={sortBy}
                sortDesc={sortDesc}
                onClick={handleSortBy("demolitionYear")}
              >
                Rivningsår
              </SortButton>
            </div>
          </div>
          <div className="col-start-1 row-start-2 px-5 pb-20">
            <ul className="grid auto-rows-fr grid-cols-1 items-start gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {loading ? (
                <ListSkeleton items={12} />
              ) : (
                buildings &&
                rows.map((building) => (
                  <li key={building.properties._id}>
                    <a
                      href={`${pathname}?${buildingToQueryParams(
                        building.properties,
                      )}`}
                      onClick={(e) =>
                        handleSelectBuilding(building.properties, e)
                      }
                      className="hover:acan-blue text-gray-list flex w-full flex-col gap-2 text-left focus-visible:text-acan-blue"
                    >
                      <BuildingImage
                        images={building.properties.images}
                        state={building.properties.state}
                        sizes="(min-width: 1600px) 16vw, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 49vw, 99vw"
                      />
                      <BuildingHeading building={building.properties} list />
                    </a>
                  </li>
                ))
              )}
            </ul>
          </div>
        </main>
      </div>
    </>
  );
};
const SortButton: FC<
  PropsWithChildren<{
    sortKey: keyof FeatureBuilding;
    sortBy: string;
    sortDesc?: boolean;
    onClick: () => void;
  }>
> = ({ sortKey, sortBy, sortDesc, onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className={classNames(
        "whitespace-nowrap uppercase outline-none hover:text-acan-blue focus-visible:text-acan-blue",
        sortBy === sortKey && "underline",
      )}
    >
      {children}
      <SortArrow descending={sortBy === sortKey ? sortDesc : undefined} />
    </button>
  );
};
