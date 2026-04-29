import { logEvent } from "@/lib/server/ops";

type ReverseOptions = {
  requestId?: string;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchWithTimeout = async (url: string, timeoutMs: number) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
};

export const reverse = async (
  lat: string | number,
  lng: string | number,
  options?: ReverseOptions,
) => {
  if (!process.env.GEOAPIFY_TOKEN) return undefined;
  const requestId = options?.requestId;
  const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&lang=nl&apiKey=${process.env.GEOAPIFY_TOKEN}`;
  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const geoapifyResponse = await fetchWithTimeout(url, 4000);
      if (!geoapifyResponse.ok) {
        if (
          (geoapifyResponse.status === 429 || geoapifyResponse.status >= 500) &&
          attempt < maxAttempts
        ) {
          await sleep(150 * attempt);
          continue;
        }
        logEvent("warn", "reverse.upstream_non_ok", {
          requestId,
          status: geoapifyResponse.status,
          attempt,
        });
        return undefined;
      }
      const results = (await geoapifyResponse.json()) as {
        features?: Array<{
          properties?: {
            postcode?: string;
            city?: string;
            street?: string;
            housenumber?: string;
          };
        }>;
      };
      if (!Array.isArray(results.features) || results.features.length === 0) {
        return undefined;
      }
      const properties = results.features[0]?.properties;
      if (!properties) return undefined;
      const reverseGeocodeResponse: ReverseGeocodeResult = {
        address: [properties.street, properties.housenumber]
          .filter(Boolean)
          .join(" "),
        postcode: properties.postcode ?? "",
        city: properties.city ?? "",
      };
      return reverseGeocodeResponse;
    } catch (error) {
      if (attempt >= maxAttempts) {
        logEvent("warn", "reverse.upstream_error", {
          requestId,
          attempt,
          message: error instanceof Error ? error.message : "unknown_error",
        });
        return undefined;
      }
      await sleep(150 * attempt);
    }
  }
  return undefined;
};
