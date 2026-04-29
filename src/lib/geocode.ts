interface GeocodeResult {
  lat: number;
  lng: number;
  confidence?: number;
}

interface AddressParts {
  address?: string;
  city?: string;
  postcode?: string;
  blockName?: string;
  country?: string;
}

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

export const buildAddressString = (parts: AddressParts): string => {
  const segments = [
    parts.address,
    parts.blockName,
    parts.postcode,
    parts.city,
    parts.country,
  ]
    .map((segment) => (segment ?? "").trim())
    .filter(Boolean);
  return segments.join(", ");
};

export const geocode = async (
  address: string,
  countryCode?: string,
): Promise<GeocodeResult | undefined> => {
  const apiKey = process.env.GEOAPIFY_TOKEN;
  if (!apiKey || !address.trim()) return undefined;

  const params = new URLSearchParams({
    text: address,
    lang: "nl",
    apiKey,
  });

  if (countryCode) {
    params.set("filter", `countrycode:${countryCode.toLowerCase()}`);
  }

  const url = `https://api.geoapify.com/v1/geocode/search?${params.toString()}`;
  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetchWithTimeout(url, 5000);
      if (!response.ok) {
        if ((response.status === 429 || response.status >= 500) && attempt < maxAttempts) {
          await sleep(200 * attempt);
          continue;
        }
        return undefined;
      }

      const json = (await response.json()) as {
        features?: Array<{
          properties?: {
            lat?: number;
            lon?: number;
            rank?: { confidence?: number };
          };
        }>;
      };

      const first = json.features?.[0]?.properties;
      if (typeof first?.lat !== "number" || typeof first?.lon !== "number") {
        return undefined;
      }

      return {
        lat: first.lat,
        lng: first.lon,
        confidence: first.rank?.confidence,
      };
    } catch {
      if (attempt >= maxAttempts) return undefined;
      await sleep(200 * attempt);
    }
  }
  return undefined;
};
