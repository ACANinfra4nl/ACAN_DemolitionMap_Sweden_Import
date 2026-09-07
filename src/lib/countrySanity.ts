/** Canonical Sanity project IDs and local preview URLs per country deployment. */
export const COUNTRY_DEPLOYMENTS = {
  nl: {
    projectId: "q9jkymv5",
    mapSlug: "kaart",
    localOrigin: "http://localhost:3000",
    code: "NL",
  },
  au: {
    projectId: "yps8kvw9",
    mapSlug: "map",
    localOrigin: "http://localhost:3001",
    code: "AU",
  },
  dk: {
    projectId: "obfbyt9x",
    mapSlug: "kort",
    localOrigin: "http://localhost:3002",
    code: "DK",
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
