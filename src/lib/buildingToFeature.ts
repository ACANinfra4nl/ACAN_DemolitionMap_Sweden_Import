import { Feature, Point } from "geojson";
import { urlForImage } from "../../sanity/lib/image";

export const toFeature = <T extends { location: { lat: number; lng: number } }>(
  properties: T,
): Feature<Point, T> => ({
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [properties.location.lng, properties.location.lat],
  },
  properties,
});

export const buildingToFeature = <T extends LatLng>(
  building: SanityBuilding<T>,
): Feature<Point, FeatureBuilding> =>
  toFeature({
    ...building,
    images: building.images
      ?.map((image) => urlForImage(image).url())
      .filter(Boolean) as string[],
  });
