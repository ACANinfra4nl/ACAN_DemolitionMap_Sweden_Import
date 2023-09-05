import { Feature, Point } from "geojson";
import { type ImageUrlBuilder } from "sanity";

export const buildingToFeature = <T extends LatLng>(
  building: SanityBuilding<T>,
  imageUrlBuilder: ImageUrlBuilder
): Feature<Point> => ({
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [building.location.lng, building.location.lat],
  },
  properties: {
    ...building,
    image: building.image?.asset?._ref
      ? imageUrlBuilder.image(building.image?.asset?._ref).url()
      : undefined,
  },
});
