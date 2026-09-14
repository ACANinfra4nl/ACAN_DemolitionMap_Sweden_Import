/**
 * Single-branch country config. Deployments share kauter-dev; LANGUAGE selects
 * a row here (Sanity project, map slug, local overlay URL, geocode language,
 * feature flags). AU/DK overlay URLs stay localhost until those sites go live.
 * `overlayLayers` is off for every country until we turn it on per group.
 */
export const COUNTRY_DEPLOYMENTS = {
  nl: {
    projectId: "q9jkymv5",
    mapSlug: "kaart",
    localOrigin: "http://localhost:3000",
    code: "NL",
    geocodeLang: "nl",
    features: {
      overlayLayers: false,
      englishToggle: true,
      studioLogo: false,
    },
  },
  au: {
    projectId: "yps8kvw9",
    mapSlug: "map",
    localOrigin: "http://localhost:3001",
    code: "AU",
    geocodeLang: "en",
    features: {
      overlayLayers: false,
      englishToggle: false,
      studioLogo: true,
    },
  },
  dk: {
    projectId: "obfbyt9x",
    mapSlug: "kort",
    localOrigin: "http://localhost:3002",
    code: "DK",
    geocodeLang: "da",
    features: {
      overlayLayers: false,
      englishToggle: true,
      studioLogo: true,
    },
  },
} as const;

export const COUNTRY_SANITY_PROJECT_IDS = {
  nl: COUNTRY_DEPLOYMENTS.nl.projectId,
  au: COUNTRY_DEPLOYMENTS.au.projectId,
  dk: COUNTRY_DEPLOYMENTS.dk.projectId,
} as const;

export type CountrySanityLocale = keyof typeof COUNTRY_DEPLOYMENTS;

export const COUNTRY_SANITY_LOCALES: CountrySanityLocale[] = ["nl", "au", "dk"];

export const isCountrySanityLocale = (
  value: string | undefined,
): value is CountrySanityLocale =>
  value === "nl" || value === "au" || value === "dk";

export function getHomeCountryCode(
  language: string | undefined = process.env.LANGUAGE,
): CountrySanityLocale | undefined {
  const locale = (language ?? "").toLowerCase().trim();
  return isCountrySanityLocale(locale) ? locale : undefined;
}

/** AU/DK can upload an SVG in Studio Settings; NL keeps the hardcoded logo. */
export function countryUsesStudioLogo(
  language: string | undefined = process.env.LANGUAGE,
): boolean {
  const home = getHomeCountryCode(language);
  return home ? COUNTRY_DEPLOYMENTS[home].features.studioLogo : false;
}

export function overlayBuildingUrl(
  country: CountrySanityLocale,
  buildingId: string,
): string {
  const deployment = COUNTRY_DEPLOYMENTS[country];
  return `${deployment.localOrigin}/${deployment.mapSlug}?view=${encodeURIComponent(buildingId)}`;
}

export function resolveSanityProjectId(
  language: string | undefined = process.env.LANGUAGE,
  explicit: string | undefined = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
): string {
  const fromEnv = explicit?.trim();
  if (fromEnv && fromEnv !== "YOUR-PROJECT-ID") {
    return fromEnv;
  }

  const locale = (language ?? "").toLowerCase().trim();
  if (isCountrySanityLocale(locale)) {
    return COUNTRY_SANITY_PROJECT_IDS[locale];
  }

  throw new Error(
    `Missing NEXT_PUBLIC_SANITY_PROJECT_ID and no Sanity project mapped for LANGUAGE="${language ?? ""}"`,
  );
}
