import { Feature, Point } from "geojson";
import { type ImageUrlBuilder } from "sanity";

export const buildingToFeature = <T extends LatLng>(
  building: SanityBuilding<T>,
  imageUrlBuilder: ImageUrlBuilder
): Feature<Point, FeatureBuilding> => ({
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [building.location.lng, building.location.lat],
  },
  properties: {
    ...building,
    images: building.images
      ?.map((image) =>
        image.asset?._ref
          ? imageUrlBuilder.image(image.asset?._ref).url()
          : undefined
      )
      .filter(Boolean) as string[],
  },
});
