import { countryUsesStudioLogo } from "./countrySanity";

type SettingsLogo = {
  logo?: {
    asset?: {
      url?: string | null;
    } | null;
  } | null;
};

/** Published Studio SVG URL for AU/DK. NL always returns undefined. */
export function getSettingsLogoUrl(
  settings: SettingsLogo | null | undefined,
  language?: string,
): string | undefined {
  if (!countryUsesStudioLogo(language)) return undefined;
  const url = settings?.logo?.asset?.url?.trim();
  return url || undefined;
}
