import { createClient, type SanityClient } from "@sanity/client";
import {
  COUNTRY_DEPLOYMENTS,
  COUNTRY_SANITY_LOCALES,
  getHomeCountryCode,
  isCountrySanityLocale,
  type CountrySanityLocale,
} from "./countrySanity";

export const IMPORT_COUNTRY_LABELS: Record<CountrySanityLocale, string> = {
  nl: "Netherlands",
  au: "Australia",
  dk: "Denmark",
};

const COUNTRY_TOKEN_ENV: Record<CountrySanityLocale, string> = {
  nl: "SANITY_AUTH_TOKEN_NL",
  au: "SANITY_AUTH_TOKEN_AU",
  dk: "SANITY_AUTH_TOKEN_DK",
};

export function resolveImportCountry(
  requested?: string,
): CountrySanityLocale | undefined {
  if (isCountrySanityLocale(requested)) return requested;
  return getHomeCountryCode();
}

export function getCountryWriteToken(
  country: CountrySanityLocale,
): string | undefined {
  const specific = process.env[COUNTRY_TOKEN_ENV[country]]?.trim();
  if (specific) return specific;
  if (getHomeCountryCode() === country) {
    return process.env.SANITY_AUTH_TOKEN?.trim() || undefined;
  }
  return undefined;
}

export function listImportCountries() {
  return COUNTRY_SANITY_LOCALES.map((id) => ({
    id,
    label: IMPORT_COUNTRY_LABELS[id],
    projectId: COUNTRY_DEPLOYMENTS[id].projectId,
    hasWriteToken: Boolean(getCountryWriteToken(id)),
  }));
}

export function createImportClient(country: CountrySanityLocale): SanityClient {
  const token = getCountryWriteToken(country);
  if (!token) {
    throw new Error(
      `No write token for ${IMPORT_COUNTRY_LABELS[country]}. Set ${COUNTRY_TOKEN_ENV[country]} in .env.local, or run the ${idToHint(country)} app with SANITY_AUTH_TOKEN for that project.`,
    );
  }

  return createClient({
    projectId: COUNTRY_DEPLOYMENTS[country].projectId,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2023-09-01",
    token,
    useCdn: false,
  });
}

function idToHint(country: CountrySanityLocale): string {
  return country.toUpperCase();
}
