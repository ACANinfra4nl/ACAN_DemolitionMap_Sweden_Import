"use client";
import { Navigation } from "@/components/Navigation";
import { fetchBuildings } from "@/lib/fetchBuildings";
import { BuildingsContext } from "@/state/buildings";
import classNames from "classnames";
import type { Feature, Point } from "geojson";
import Link from "next/link";
import {
  ChangeEventHandler,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const matchesIgnoreCase = (haystack: string | undefined, needle: string) =>
  haystack?.toLowerCase().includes(needle.toLowerCase());

const filterBuildings =
  (filter: string) => (feature: Feature<Point, FeatureBuilding>) =>
    matchesIgnoreCase(feature.properties.description, filter) ||
    matchesIgnoreCase(feature.properties.demolitionCause, filter) ||
    matchesIgnoreCase(feature.properties.address, filter) ||
    matchesIgnoreCase(feature.properties.city, filter) ||
    matchesIgnoreCase(feature.properties.category, filter);

export default function ListPage() {
  const [filter, setFilter] = useState("");
  const buildings = useContext(BuildingsContext);
  const handleFilterChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const value = e.target.value;
      setFilter(value.trim());
    },
    []
  );

  return (
    <>
      <Navigation />
      <main className="p-4">
        <div className="mb-4 flex gap-2 items-center">
          <label htmlFor="filter">Filter</label>
          <input
            id="filter"
            type="text"
            name="filter"
            className="border border-gray-200 flex-grow px-2 py-1"
            onChange={handleFilterChange}
          />
        </div>
        <ul>
          {buildings.features
            .filter(filterBuildings(filter))
            .map((building) => (
              <li key={building.properties._id} className="mb-2">
                <pre>{JSON.stringify(building.properties, null, 2)}</pre>
              </li>
            ))}
        </ul>
      </main>
    </>
  );
}
