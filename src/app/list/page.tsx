"use client";
import { fetchBuildings } from "@/lib/fetchBuildings";
import type { Feature, Point } from "geojson";
import { ChangeEventHandler, useCallback, useEffect, useState } from "react";

const matchesIgnoreCase = (haystack: string, needle: string) =>
  haystack.toLowerCase().includes(needle.toLowerCase());

const filterBuildings =
  (filter: string) => (feature: Feature<Point, SanityBuilding<LatLng>>) =>
    matchesIgnoreCase(feature.properties.name, filter) ||
    matchesIgnoreCase(feature.properties.description, filter);

export default function ListPage() {
  const [filter, setFilter] = useState("");
  const [buildings, setBuildings] = useState<
    Awaited<ReturnType<typeof fetchBuildings>>
  >([]);
  useEffect(() => {
    fetchBuildings().then(setBuildings);
  }, []);
  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const value = e.target.value;
      setFilter(value);
    },
    []
  );

  return (
    <main className="p-4">
      <div>
        <label>
          Filter
          <input onChange={handleChange} />
        </label>
      </div>
      <ul>
        {buildings.filter(filterBuildings(filter)).map((building) => (
          <li key={building.properties._id} className="mb-2">
            {building.properties.name}
          </li>
        ))}
      </ul>
    </main>
  );
}
