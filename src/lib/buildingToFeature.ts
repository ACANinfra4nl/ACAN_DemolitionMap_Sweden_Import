import { Feature, Point } from "geojson";

export const buildingToFeature = <T extends LatLng>(
  building: SanityBuilding<T>
): Feature<Point> => ({
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [building.location.lng, building.location.lat],
  },
  properties: { ...building },
});
