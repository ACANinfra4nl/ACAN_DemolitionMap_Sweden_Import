import { Feature, Point } from "geojson";

export const fetchBuildings = () =>
  fetch("/api/buildings", { next: { tags: ["buildings"] } }).then(
    (r) => r.json() as unknown as Feature<Point, SanityBuilding<LatLng>>[]
  );
