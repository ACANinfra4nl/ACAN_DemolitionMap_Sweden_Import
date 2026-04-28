export const reverse = async (lat: string | number, lng: string | number) => {
  if (!process.env.GEOAPIFY_TOKEN) return undefined;
  const geoapifyResponse = await fetch(
    `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&lang=nl&apiKey=${process.env.GEOAPIFY_TOKEN}`,
  );
  if (!geoapifyResponse.ok) return undefined;
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
};
