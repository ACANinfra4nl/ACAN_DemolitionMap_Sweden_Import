import "server-only";
import { cookies } from "next/headers";

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

type DictKey = keyof typeof dictionaries;

const loadDictionary = async (key: string) => {
  const loader = dictionaries[key as DictKey] || dictionaries.en;
  return loader();
};

const readUiLangCookie = () => {
  try {
    return cookies().get("ui-lang")?.value;
  } catch {
    return undefined;
  }
};

/** Dictionary for the deployed country (`LANGUAGE`). Use this for slugs and static params. */
export const getHomeDictionary = async () => loadDictionary(locale);

/** UI strings. May overlay English from the `ui-lang` cookie; slugs and map bounds stay home. */
export const getDictionary = async () => {
  const home = await getHomeDictionary();
  const wantsEnglish = readUiLangCookie() === "en";
  if (!wantsEnglish || home.nav.language === "en") return home;
  const english = await loadDictionary("en");
  return {
    ...english,
    slugs: home.slugs,
    map: home.map,
  };
};
