import { Feature, Point } from "geojson";
import { translateState } from "./translateState";

export const toFeature = <
  T extends {
    location: { _type?: string; lat: number; lng: number };
    state: string;
    category: string;
  },
>(
  properties: T,
  dict?: Dictionary,
): Feature<Point, T> => {
  if (dict) {
    properties = translateState(properties, dict);
  }

  return {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [properties.location.lng, properties.location.lat],
    },
    properties,
  };
};
