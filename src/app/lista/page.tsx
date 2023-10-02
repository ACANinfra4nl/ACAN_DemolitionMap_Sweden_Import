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
  useState,
} from "react";
import { FilterButton } from "@/components/FilterButton";
import { StateIcon } from "@/components/StateIcon";

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
  const [filter, setFilter] = useState("");
  const [stateFilter, setStateFilter] = useState<string>();
  const buildings = useContext(BuildingsContext);
  const [selectedBuilding, setSelectedBuilding] = useState<FeatureBuilding>();
  const [sortBy, setSortBy] = useState<keyof typeof SORTERS>("buildYear");
  const [sortDesc, setSortDesc] = useState(false);
  const handleFilterChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const value = e.target.value;
      setFilter(value.trim());
    },
    [],
  );

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
    <>
      <main className="grid h-screen grid-cols-1 grid-rows-[auto_1fr] overflow-hidden">
        <div className="col-start-1 row-start-1">
          <Navigation />
        </div>
        {/* <main className="grid grid-cols-1 grid-rows-1 overflow-hidden"> */}
        {selectedBuilding ? (
          <div className="col-start-1 row-span-2 row-start-1 grid grid-cols-3 grid-rows-1 overflow-hidden">
            <div className="z-10 col-start-1 col-end-2 row-start-1 bg-white">
              <DetailsPanel
                properties={selectedBuilding}
                onClose={() => setSelectedBuilding(undefined)}
              />
            </div>
            <div className="col-start-2 col-end-4 row-start-1 bg-black">
              <DetailsMap building={selectedBuilding} />
            </div>
          </div>
        ) : (
          <div className="col-start-1 row-start-2 overflow-scroll scroll-smooth px-5">
            <div className="mb-4 flex w-full gap-4">
              <div className="flex gap-2">
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
              <div className="flex flex-grow items-center gap-2">
                <input
                  aria-label="Filtrera"
                  id="filter"
                  type="text"
                  name="filter"
                  className="flex-grow border-b border-current"
                  onChange={handleFilterChange}
                />
              </div>
              <div className="flex items-center gap-2">
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
            {buildings.loading ? (
              <span>Loading&hellip;</span>
            ) : (
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {rows.map((building) => (
                  <li key={building.properties._id}>
                    <button
                      onClick={() => setSelectedBuilding(building.properties)}
                      className="flex w-full flex-col gap-2 text-left hover:text-blue-500"
                    >
                      <div className="relative aspect-[3/2] w-full">
                        <div className="absolute left-2 top-2"></div>
                        {building.properties.images &&
                        building.properties.images.length > 0 ? (
                          <img
                            src={building.properties.images[0]}
                            className="aspect-[3/2] w-full object-cover"
                          />
                        ) : (
                          <div className="flex aspect-[3/2] w-full items-center justify-center bg-gray-100 object-cover text-gray-300">
                            Bild saknas
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <div>
                          {building.properties.address}
                          <br />
                          {building.properties.postcode}{" "}
                          {building.properties.city}
                        </div>
                        <StateIcon state={building.properties.state} />
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </main>
      {/* </div> */}
    </>
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
      className={classNames(sortBy === sortKey && "underline")}
    >
      {children}
      <SortArrow descending={sortBy === sortKey ? sortDesc : undefined} />
    </button>
  );
};
