import {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
  Point,
} from "geojson";

export const latLngToFeature = <T extends Record<string, unknown>>(
  latLng: LatLng,
  props: T
): Feature<Point> => ({
  type: "Feature",
  geometry: { type: "Point", coordinates: [latLng.lng, latLng.lat] },
  properties: { ...props },
});

export const appendFeature = <G extends Geometry, P = GeoJsonProperties>(
  collection: FeatureCollection<G, P>,
  feature: Feature<G, P>
): FeatureCollection<G, P> => ({
  type: "FeatureCollection",
  features: [...collection.features, feature],
});
