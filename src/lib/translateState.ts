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
  const translateValue = <
    K extends keyof typeof dict.states | keyof typeof dict.categories,
  >(
    key: string,
    dictionary: typeof dict.states | typeof dict.categories,
  ) => dictionary[key as K];

  properties.state =
    translateValue(properties.state, dict.states) || properties.state;
  properties.category =
    translateValue(properties.category, dict.categories) || properties.category;

  return properties;
};
