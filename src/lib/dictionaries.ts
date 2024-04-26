import "server-only";

const locale = process.env.LANGUAGE;
const dictionaries = {
  sv: () => import("../dictionaries/sv.json").then((module) => module.default),
  no: () => import("../dictionaries/no.json").then((module) => module.default),
  fi: () => import("../dictionaries/fi.json").then((module) => module.default),
};

export const getDictionary = async () =>
  dictionaries[locale as keyof typeof dictionaries]();
