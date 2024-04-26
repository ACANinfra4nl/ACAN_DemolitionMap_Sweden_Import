import { categories } from "./categories";
import { states } from "./states";

export const translateState = <
  T extends {
    location: { _type?: string; lat: number; lng: number };
    state: string;
    category: string;
  },
>(
  properties: T,
  dict: Dictionary,
) => {
  properties.state =
    dict.states[
      states.find((c) => c.value === properties.state)
        ?.title as keyof typeof dict.states
    ];
  properties.category =
    dict.categories[
      categories.find((c) => c.value === properties.category)
        ?.title as keyof typeof dict.categories
    ];

  return properties;
};
