/**
 * Forward geocoding - convert address to coordinates
 * Uses Geoapify API to geocode addresses
 */

export interface GeocodeResult {
  lat: number;
  lng: number;
  confidence?: number;
}

/**
 * Geocode an address string to get latitude and longitude
 * @param address - Address string (can include street, city, postcode, etc.)
 * @param country - Optional country code to improve accuracy (e.g., "AU" for Australia)
 * @returns GeocodeResult with lat/lng or null if geocoding fails
 */
export async function geocode(
  address: string,
  country?: string,
): Promise<GeocodeResult | null> {
  if (!process.env.GEOAPIFY_TOKEN) {
    console.warn('GEOAPIFY_TOKEN not set, cannot geocode address');
    return null;
  }

  if (!address || address.trim() === '') {
    return null;
  }

  // Clean and validate address string
  const cleanAddress = address.trim();
  if (cleanAddress.length < 3) {
    // Address too short to be useful
    return null;
  }

  const lang = process.env.LANGUAGE === 'au' ? 'en' : process.env.LANGUAGE === 'dk' ? 'da' : 'nl';
  
  // Try without country filter first (more reliable)
  // If that fails, we can try with filter, but filters can cause 400 errors
  const params = new URLSearchParams({
    text: cleanAddress,
    lang: lang,
    apiKey: process.env.GEOAPIFY_TOKEN,
    limit: '1', // Only need the best match
  });

  // Only add country filter if explicitly needed (can cause 400 errors)
  // For now, we'll skip the filter and rely on the address text being specific enough
  // If country is provided, we can add it to the address string instead
  if (country && !cleanAddress.toLowerCase().includes(country.toLowerCase())) {
    // Add country to address string rather than using filter
    params.set('text', `${cleanAddress}, ${country}`);
  }

  try {
    const url = `https://api.geoapify.com/v1/geocode/search?${params.toString()}`;
    
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Geocoding API error: ${response.status} ${response.statusText}`,
      );
      console.error(`Request URL: ${url.replace(process.env.GEOAPIFY_TOKEN || '', 'HIDDEN')}`);
      console.error(`Error response: ${errorText}`);
      
      // If it's a 400 error, try with just the address (no country appended)
      if (response.status === 400) {
        console.warn('Retrying geocoding with original address only...');
        const retryParams = new URLSearchParams({
          text: cleanAddress,
          lang: lang,
          apiKey: process.env.GEOAPIFY_TOKEN,
          limit: '1',
        });
        const retryUrl = `https://api.geoapify.com/v1/geocode/search?${retryParams.toString()}`;
        const retryResponse = await fetch(retryUrl);
        
        if (!retryResponse.ok) {
          const retryErrorText = await retryResponse.text();
          console.error(`Retry also failed: ${retryResponse.status} - ${retryErrorText}`);
          return null;
        }
        
        const retryData = await retryResponse.json();
        if (
          !retryData.features ||
          retryData.features.length === 0 ||
          !retryData.features[0].geometry ||
          !retryData.features[0].geometry.coordinates
        ) {
          return null;
        }
        
        const feature = retryData.features[0];
        const [lng, lat] = feature.geometry.coordinates;
        const confidence =
          feature.properties?.rank?.confidence ||
          feature.properties?.confidence ||
          undefined;
        
        return { lat, lng, confidence };
      }
      
      return null;
    }

    const data = await response.json();

    if (
      !data.features ||
      data.features.length === 0 ||
      !data.features[0].geometry ||
      !data.features[0].geometry.coordinates
    ) {
      console.warn(`No geocoding results for address: ${address}`);
      return null;
    }

    const feature = data.features[0];
    const [lng, lat] = feature.geometry.coordinates;

    // Get confidence score if available
    const confidence =
      feature.properties?.rank?.confidence ||
      feature.properties?.confidence ||
      undefined;

    return {
      lat,
      lng,
      confidence,
    };
  } catch (error) {
    console.error(`Geocoding error for address "${address}":`, error);
    return null;
  }
}

/**
 * Build an address string from individual address components
 */
export function buildAddressString(components: {
  address?: string;
  city?: string;
  postcode?: string;
  blockName?: string;
  country?: string;
}): string {
  const parts: string[] = [];

  if (components.address) parts.push(components.address);
  if (components.blockName) parts.push(components.blockName);
  if (components.city) parts.push(components.city);
  if (components.postcode) parts.push(components.postcode);
  if (components.country) parts.push(components.country);

  return parts.filter(Boolean).join(', ');
}

