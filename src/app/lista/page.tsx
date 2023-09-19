"use client";
import { Navigation } from "@/components/Navigation";
import { BuildingsContext } from "@/state/buildings";
import classNames from "classnames";
import type { Feature, Point } from "geojson";
import Link from "next/link";
import {
  ChangeEventHandler,
  FC,
  MouseEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

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
        matchesIgnoreCase(feature.properties.category, filter)
    );

const buildYearSorter = (a: BuildingFeature, b: BuildingFeature) =>
  a.properties.buildYear - b.properties.buildYear;
const demolitionYearSorter = (a: BuildingFeature, b: BuildingFeature) =>
  a.properties.demolitionYear - b.properties.demolitionYear;

const SORTERS = {
  buildYear: buildYearSorter,
  demolitionYear: demolitionYearSorter,
};

const StateIndicator: FC<{ state: string }> = ({ state }) => (
  <div
    className={classNames("rounded-full w-6 h-6", {
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
  const buildings = useContext(BuildingsContext);
  const [sortBy, setSortBy] = useState<keyof typeof SORTERS>("buildYear");
  const [sortDesc, setSortDesc] = useState(false);
  const handleFilterChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const value = e.target.value;
      setFilter(value.trim());
    },
    []
  );

  const handleSortBy = (key: keyof typeof SORTERS) => (e: MouseEvent) => {
    if (sortBy === key) setSortDesc((old) => !old);
    else setSortDesc(false);
    setSortBy(key);
  };

  let rows = buildings.features
    .filter(filterBuildings(filter))
    .sort(SORTERS[sortBy]);
  if (sortDesc) rows.reverse();

  return (
    <>
      <Navigation />
      <main className="p-4">
        <div className="flex gap-4 items-center w-full">
          <div className="mb-4 flex gap-2 items-center flex-grow">
            <label htmlFor="filter">Filtrera</label>
            <input
              id="filter"
              type="text"
              name="filter"
              className="border border-gray-200 flex-grow px-2 py-1"
              onChange={handleFilterChange}
              // list="filter-options"
            />
            {/* <datalist id="filter-options" className="captialize">
              <option>hotad</option>
              <option>riven</option>
              <option>räddad</option>
              <option>bostad</option>
              <option>kontor</option>
              <option>kommersiell</option>
              <option>samhällsfastighet</option>
              <option>industri</option>
              <option>övrig</option>
            </datalist> */}
          </div>
          <div className="mb-4 flex gap-2">
            <span>Sortera</span>{" "}
            <button
              onClick={handleSortBy("buildYear")}
              className={classNames(sortBy === "buildYear" && "underline")}
            >
              Byggår
              <SortArrow
                descending={sortBy === "buildYear" ? sortDesc : undefined}
              />
            </button>{" "}
            <button
              onClick={handleSortBy("demolitionYear")}
              className={classNames(sortBy === "demolitionYear" && "underline")}
            >
              Rivningsår
              <SortArrow
                descending={sortBy === "demolitionYear" ? sortDesc : undefined}
              />
            </button>
          </div>
        </div>
        {buildings.loading ? (
          <span>Loading&hellip;</span>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {rows.map((building) => (
              <li key={building.properties._id} className="flex flex-col gap-2">
                <div className="relative aspect-[3/2] w-full">
                  <div className="absolute top-2 left-2">
                    <StateIndicator state={building.properties.state} />
                  </div>
                  {building.properties.images && (
                    <img
                      src={building.properties.images[0]}
                      className="aspect-[3/2] w-full object-cover"
                    />
                  )}
                </div>
                <div>
                  {building.properties.address}
                  <br />
                  {building.properties.postcode} {building.properties.city}
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
