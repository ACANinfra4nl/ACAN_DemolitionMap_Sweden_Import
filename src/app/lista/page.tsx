"use client";
import { Navigation } from "@/components/Navigation";
import { BuildingsContext } from "@/state/buildings";
import { BuildingFeature } from "@/types";
import classNames from "classnames";
import type { Feature, Point } from "geojson";
import Link from "next/link";
import {
  ChangeEventHandler,
  MouseEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const matchesIgnoreCase = (haystack: string | undefined, needle: string) =>
  haystack?.toLowerCase().includes(needle.toLowerCase());

const filterBuildings = (filter: string) => (feature: BuildingFeature) =>
  matchesIgnoreCase(feature.properties.description, filter) ||
  matchesIgnoreCase(feature.properties.demolitionCause, filter) ||
  matchesIgnoreCase(feature.properties.address, filter) ||
  matchesIgnoreCase(feature.properties.city, filter) ||
  matchesIgnoreCase(feature.properties.architect, filter) ||
  matchesIgnoreCase(feature.properties.propertyOwner, filter) ||
  matchesIgnoreCase(feature.properties.propertyDesignation, filter) ||
  matchesIgnoreCase(feature.properties.blockName, filter) ||
  matchesIgnoreCase(feature.properties.category, filter);

const buildYearSorter = (a: BuildingFeature, b: BuildingFeature) =>
  a.properties.buildYear - b.properties.buildYear;
const demolitionYearSorter = (a: BuildingFeature, b: BuildingFeature) =>
  a.properties.demolitionYear - b.properties.demolitionYear;

const SORTERS = {
  buildYear: buildYearSorter,
  demolitionYear: demolitionYearSorter,
};

export default function ListPage() {
  const [filter, setFilter] = useState("");
  const buildings = useContext(BuildingsContext);
  const [sortBy, setSortBy] = useState<keyof typeof SORTERS>("buildYear");
  const [sortDir, setSortDir] = useState(false);
  const handleFilterChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const value = e.target.value;
      setFilter(value.trim());
    },
    []
  );

  const handleSortBy = (key: keyof typeof SORTERS) => (e: MouseEvent) => {
    if (sortBy === key) setSortDir((old) => !old);
    else setSortDir(false);
    setSortBy(key);
  };

  let rows = buildings.features
    .filter(filterBuildings(filter))
    .sort(SORTERS[sortBy]);
  if (sortDir) rows.reverse();

  return (
    <>
      <Navigation />
      <main className="p-4">
        <div className="mb-4 flex gap-2 items-center">
          <label htmlFor="filter">Filtrera</label>
          <input
            id="filter"
            type="text"
            name="filter"
            className="border border-gray-200 flex-grow px-2 py-1"
            onChange={handleFilterChange}
          />
        </div>
        <div className="mb-4 flex gap-2">
          <span>Sortera</span>{" "}
          <button onClick={handleSortBy("buildYear")}>
            Byggår
            {sortBy === "buildYear" &&
              (sortDir ? <span>↓</span> : <span>↑</span>)}
          </button>{" "}
          <button onClick={handleSortBy("demolitionYear")}>
            Rivningsår
            {sortBy === "demolitionYear" &&
              (sortDir ? <span>↓</span> : <span>↑</span>)}
          </button>
        </div>
        <ul>
          {rows.map((building) => (
            <li key={building.properties._id} className="mb-2">
              <details>
                <summary>
                  {building.properties.address}, {building.properties.postcode}{" "}
                  {building.properties.city}
                </summary>
                <pre>{JSON.stringify(building.properties, null, 2)}</pre>
              </details>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
