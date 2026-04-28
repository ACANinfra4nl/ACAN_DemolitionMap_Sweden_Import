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

  const response = await fetch(
    `https://api.geoapify.com/v1/geocode/search?${params.toString()}`,
  );
  if (!response.ok) return undefined;

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
  if (
    typeof first?.lat !== "number" ||
    typeof first?.lon !== "number"
  ) {
    return undefined;
  }

  return {
    lat: first.lat,
    lng: first.lon,
    confidence: first.rank?.confidence,
  };
};
