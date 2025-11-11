import "server-only";

const locale = process.env.LANGUAGE;
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
};

export const getDictionary = async () =>
  dictionaries[locale as keyof typeof dictionaries]();
