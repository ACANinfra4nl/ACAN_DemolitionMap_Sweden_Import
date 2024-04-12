import { Feature, Point } from "geojson";

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
    switch (properties.state) {
      case "hotad":
        properties = {
          ...properties,
          state: dict.states["threatened" as keyof typeof dict.states],
        };

        break;
      case "riven":
        properties = {
          ...properties,
          state: dict.states["demolished" as keyof typeof dict.states],
        };
        break;
      case "räddad":
        properties = {
          ...properties,
          state: dict.states["saved" as keyof typeof dict.states],
        };
        break;
    }
    switch (properties.category) {
      case "bostad":
        properties = {
          ...properties,
          category:
            dict.categories["residential" as keyof typeof dict.categories],
        };
        break;
      case "kontor":
        properties = {
          ...properties,
          category: dict.categories["office" as keyof typeof dict.categories],
        };
        break;
      case "kommersiell":
        properties.category =
          dict.categories["commercial" as keyof typeof dict.categories];
        break;
      case "samhällsfastighet":
        properties = {
          ...properties,
          category:
            dict.categories[
              "communityProperty" as keyof typeof dict.categories
            ],
        };
        break;
      case "industri":
        properties = {
          ...properties,
          category: dict.categories["industry" as keyof typeof dict.categories],
        };
        break;
      case "övrigt":
        properties = {
          ...properties,
          category: dict.categories["other" as keyof typeof dict.categories],
        };
        break;
    }
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
