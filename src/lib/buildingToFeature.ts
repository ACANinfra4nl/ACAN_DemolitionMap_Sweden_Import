import { Feature, Point } from "geojson";
import { urlForImage } from "../../sanity/lib/image";

export const buildingToFeature = <T extends LatLng>(
  building: SanityBuilding<T>
): Feature<Point, FeatureBuilding> => ({
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [building.location.lng, building.location.lat],
  },
  properties: {
    ...building,
    images: building.images
      ?.map((image) => urlForImage(image).url())
      .filter(Boolean) as string[],
  },
});
