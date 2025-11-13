import "server-only";

const locale = (process.env.LANGUAGE as string | undefined) || "en";
const dictionaries = {
  sv: () =>
    import("../dictionaries/sv.json").then(
      (module) => module.default as unknown as Dictionary,
    ),
  no: () =>
    import("../dictionaries/no.json").then(
      (module) => module.default as unknown as Dictionary,
    ),
  fi: () =>
    import("../dictionaries/fi.json").then(
      (module) => module.default as unknown as Dictionary,
    ),
  en: () =>
    import("../dictionaries/en.json").then(
      (module) => module.default as unknown as Dictionary,
    ),
  nl: () =>
    import("../dictionaries/nl.json").then(
      (module) => module.default as unknown as Dictionary,
    ),
  au: () =>
    import("../dictionaries/au.json").then(
      (module) => module.default as unknown as Dictionary,
    ),
  dk: () =>
    import("../dictionaries/dk.json").then(
      (module) => module.default as unknown as Dictionary,
    ),
};

export const getDictionary = async () => {
  const loader =
    dictionaries[locale as keyof typeof dictionaries] || dictionaries.en;
  return loader();
};
