"use client";
import { DetailsMap } from "@/components/DetailsMap";
import { DetailsPanel } from "@/components/DetailsPanel";
import { Navigation } from "@/components/Navigation";
import { BuildingsContext } from "@/state/buildings";
import classNames from "classnames";
import {
  ChangeEventHandler,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { FilterButton } from "@/components/FilterButton";
import { StateIcon } from "@/components/StateIcon";
import { Transition } from "@headlessui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BuildingImage } from "../../components/BuildingImage";

const matchesIgnoreCase = (haystack: string | undefined, needle: string) =>
  haystack?.toLowerCase().includes(needle.toLowerCase());

const filterBuildings = (filters: string) => (feature: BuildingFeature) =>
  filters
    .split(/\s+/)
    .every(
      (filter) =>
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

const buildYearSorter = (a: BuildingFeature, b: BuildingFeature) =>
  a.properties.buildYear - b.properties.buildYear;
const demolitionYearSorter = (a: BuildingFeature, b: BuildingFeature) =>
  a.properties.demolitionYear - b.properties.demolitionYear;
const addressSorter = (a: BuildingFeature, b: BuildingFeature) =>
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

const StateIndicator: FC<{ state: string }> = ({ state }) => (
  <div
    className={classNames("h-6 w-6 rounded-full", {
      "bg-yellow-400": state === "hotad",
      "bg-green-500": state === "räddad",
      "bg-red-600": state === "riven",
    })}
  />
);

const SortArrow: FC<{ descending?: boolean }> = ({ descending }) => (
  <span className="inline-block w-4 text-center">
    {typeof descending === "boolean" && (descending ? "↓" : "↑")}
  </span>
);

export default function ListPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("view");
  const [filter, setFilter] = useState("");
  const [stateFilter, setStateFilter] = useState<string>();
  const buildings = useContext(BuildingsContext);
  const [hasSelectedBuilding, setHasSelectedBuilding] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<FeatureBuilding>();
  const [sortBy, setSortBy] = useState<keyof typeof SORTERS>("buildYear");
  const [sortDesc, setSortDesc] = useState(false);

  useEffect(() => {
    if (buildings.loading) return;

    if (selectedId) {
      setSelectedBuilding(
        buildings.features.find((f) => f.properties._id === selectedId)
          ?.properties,
      );
      setHasSelectedBuilding(true);
    } else {
      setHasSelectedBuilding(false);
    }
  }, [buildings.loading, buildings.features, selectedId]);

  const handleFilterChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const value = e.target.value;
      setFilter(value.trim());
    },
    [],
  );

  const handleSelectBuilding = useCallback(
    (building: FeatureBuilding) => {
      setSelectedBuilding(building);
      setHasSelectedBuilding(true);
      router.push(`${pathname}?view=${building._id}`);
    },
    [router, pathname],
  );

  const handleClearSelection = useCallback(() => {
    setHasSelectedBuilding(false);
    router.push(pathname);
  }, [router, pathname]);

  const handleSortBy = (key: keyof typeof SORTERS) => () => {
    if (sortBy === key) setSortDesc((old) => !old);
    else setSortDesc(false);
    setSortBy(key);
  };

  let rows = buildings.features
    .filter(
      (b) =>
        typeof stateFilter === "undefined" ||
        b.properties.state === stateFilter,
    )
    .filter(filterBuildings(filter))
    .sort(SORTERS[sortBy]);
  if (sortDesc) rows.reverse();

  return (
    <div className="h-screen">
      <header className="fixed left-0 right-0 top-0 z-10">
        <Navigation />
      </header>
      <main className="mt-header grid grid-cols-1 grid-rows-[auto_1fr] pt-[4.125rem] sm:pt-[4.75rem] md:pt-10">
        <Transition
          show={hasSelectedBuilding}
          className="fixed bottom-0 left-0 right-0 top-0 z-20 grid grid-cols-10 grid-rows-1"
        >
          <Transition.Child
            className="col-span-10 row-start-1 bg-white sm:col-span-6 sm:col-start-1 md:col-span-4 md:col-start-1"
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
            className="row-start-1 hidden bg-black sm:col-span-4 sm:col-start-7 sm:block md:col-span-6 md:col-start-5"
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
        <div className="top-header fixed z-10 grid w-full grid-cols-[auto_1fr_auto] gap-x-10 gap-y-3 px-5">
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="#000"
              strokeWidth={2}
              className="absolute bottom-1"
            >
              <circle cx="6.5" cy="6.5" r="5.5" />
              <path d="m10 10 5 5" />
            </svg>
            <input
              aria-label="Filtrera"
              id="filter"
              type="text"
              name="filter"
              className="w-full border-b border-current bg-transparent pl-6 uppercase placeholder:uppercase placeholder:text-current"
              onChange={handleFilterChange}
              placeholder="Sök"
            />
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
          {buildings.loading ? (
            <span>Loading&hellip;</span>
          ) : (
            <ul className="grid auto-rows-fr grid-cols-1 items-start gap-10 sm:grid-cols-2 lg:grid-cols-5">
              {rows.map((building) => (
                <li key={building.properties._id}>
                  <button
                    onClick={() => handleSelectBuilding(building.properties)}
                    className="hover:acan-blue flex w-full flex-col gap-2 text-left"
                  >
                    <BuildingImage
                      images={building.properties.images}
                      state={building.properties.state}
                    />
                    <div className="grid w-full grid-cols-[1fr_auto] gap-2 text-body uppercase">
                      <div className="w-full min-w-0">
                        <div className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                          {building.properties.address}
                        </div>
                        <div className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                          {building.properties.postcode}{" "}
                          {building.properties.city}
                        </div>
                      </div>
                      <StateIcon state={building.properties.state} />
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
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
        "whitespace-nowrap uppercase",
        sortBy === sortKey && "underline",
      )}
    >
      {children}
      <SortArrow descending={sortBy === sortKey ? sortDesc : undefined} />
    </button>
  );
};
