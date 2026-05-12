import { Feature, Point } from "geojson";
import { translateState } from "./translateState";

export const toFeature = <
  T extends {
    location: { _type?: string; lat: number; lng: number };
    state: string;
    status?: string;
    category: string;
    reviewed?: unknown;
  },
>(
  properties: T,
  dict?: Dictionary,
): Feature<Point, T & { reviewed: boolean }> => {
  if (dict) {
    properties = translateState(properties, dict);
  }

  const reviewed =
    properties.reviewed === true || properties.reviewed === "true";

  return {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [properties.location.lng, properties.location.lat],
    },
    properties: {
      ...(properties as object),
      reviewed,
    } as T & { reviewed: boolean },
  };
};
