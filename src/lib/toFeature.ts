import { Feature, Point } from "geojson";

export const toFeature = <
  T extends { location: { _type?: string; lat: number; lng: number } },
>(
  properties: T,
): Feature<Point, T> => ({
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [properties.location.lng, properties.location.lat],
  },
  properties,
});
