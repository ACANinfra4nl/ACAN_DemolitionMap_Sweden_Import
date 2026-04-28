/**
 * CSV/Excel to Sanity Building converter v2
 * Improved version with flexible column mapping and better error handling
 */

import { GeopointValue } from 'sanity';
import { categories } from './categories';
import { states } from './states';
import type { ColumnMapping, ImportConfig } from './importConfig';
import type { ParsedRow } from './excelParser';
import { geocode, buildAddressString } from './geocode';

const clean = (str: string | number | undefined): string =>
  str ? String(str).toLowerCase().trim() : '';

const parseNumber = (
  value: string | number | undefined,
): number | undefined => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  if (typeof value === 'number') {
    return isNaN(value) ? undefined : value;
  }
  const raw = String(value).trim();
  const isThousandsSeparated = /^-?\d{1,3}(,\d{3})+(\.\d+)?$/.test(raw);
  const normalized = isThousandsSeparated ? raw.replace(/,/g, '') : raw;
  const str = normalized.replace(',', '.');
  const num = parseFloat(str);
  return isNaN(num) ? undefined : num;
};

const normalizeCoordinate = (
  value: number | undefined,
  type: 'lat' | 'lng',
): number | undefined => {
  if (typeof value === 'undefined') return undefined;
  const abs = Math.abs(value);
  // Legacy datasets sometimes store coordinates as integer degrees * 10,000,000.
  if (abs > 180 && abs > 1e6) {
    value = value / 1e7;
  }
  const isValid =
    type === 'lat' ? value >= -90 && value <= 90 : value >= -180 && value <= 180;
  return isValid ? value : undefined;
};

const NL_BOUNDS = {
  latMin: 50,
  latMax: 54,
  lngMin: 3,
  lngMax: 8,
};

const isLikelyNlPoint = (lat: number, lng: number): boolean =>
  lat >= NL_BOUNDS.latMin &&
  lat <= NL_BOUNDS.latMax &&
  lng >= NL_BOUNDS.lngMin &&
  lng <= NL_BOUNDS.lngMax;

const shouldUseNlRescue = (): boolean => {
  const language = (process.env.LANGUAGE || '').toLowerCase().trim();
  return language === 'nl' || language === '';
};

const rescueLikelyNlCoordinates = (
  lat: number | undefined,
  lng: number | undefined,
): { lat: number; lng: number } | undefined => {
  if (typeof lat !== 'number' || typeof lng !== 'number') return undefined;
  if (!shouldUseNlRescue()) return { lat, lng };
  if (isLikelyNlPoint(lat, lng)) return { lat, lng };

  const scales = [1, 10, 100];
  const candidates: Array<{ lat: number; lng: number; score: number }> = [];

  for (const latScale of scales) {
    for (const lngScale of scales) {
      const candidateLat = lat * latScale;
      const candidateLng = lng * lngScale;
      if (isLikelyNlPoint(candidateLat, candidateLng)) {
        candidates.push({
          lat: candidateLat,
          lng: candidateLng,
          score: Math.abs(Math.log10(latScale)) + Math.abs(Math.log10(lngScale)),
        });
      }

      const swappedLat = lng * latScale;
      const swappedLng = lat * lngScale;
      if (isLikelyNlPoint(swappedLat, swappedLng)) {
        candidates.push({
          lat: swappedLat,
          lng: swappedLng,
          score:
            0.5 + Math.abs(Math.log10(latScale)) + Math.abs(Math.log10(lngScale)),
        });
      }
    }
  }

  if (candidates.length === 0) return { lat, lng };
  candidates.sort((a, b) => a.score - b.score);
  return { lat: candidates[0].lat, lng: candidates[0].lng };
};

/**
 * Parse combined lat/lng string (e.g., "Lat:-37.81651591919707 Long:144.9898159488796")
 * Returns { lat, lng } or null if parsing fails
 */
function parseCombinedLocation(
  value: string | number | undefined,
): { lat: number; lng: number } | null {
  if (!value) return null;

  const str = String(value).trim();
  
  // Try to extract lat and lng using regex
  // Pattern: Lat:number Long:number or similar variations
  const latMatch = str.match(/Lat[:\s]*(-?\d+\.?\d*)/i);
  const lngMatch = str.match(/Long[:\s]*(-?\d+\.?\d*)/i);

  if (latMatch && lngMatch) {
    const lat = parseFloat(latMatch[1]);
    const lng = parseFloat(lngMatch[1]);
    
    if (!isNaN(lat) && !isNaN(lng)) {
      return { lat, lng };
    }
  }

  // Try alternative patterns (space-separated, comma-separated)
  const numbers = str.match(/-?\d+\.?\d*/g);
  if (numbers && numbers.length >= 2) {
    const lat = parseFloat(numbers[0]);
    const lng = parseFloat(numbers[1]);
    
    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      return { lat, lng };
    }
  }

  return null;
}

const parseCategory = (str: string | number | undefined): string => {
  const cleaned = clean(str);
  if (!cleaned) return 'övrig'; // Default category

  // Try to match by value
  const byValue = categories.find((cat) => cat.value === cleaned);
  if (byValue?.value) return byValue.value;

  // Try to match by title (English)
  const byTitle = categories.find(
    (cat) => cat.title.toLowerCase() === cleaned,
  );
  if (byTitle?.value) return byTitle.value;

  // Try partial match
  const partial = categories.find((cat) =>
    cleaned.includes(cat.title.toLowerCase()) ||
    cat.title.toLowerCase().includes(cleaned),
  );
  if (partial?.value) return partial.value;

  return 'övrig'; // Default
};

const parseState = (str: string | number | undefined): string => {
  const cleaned = clean(str);
  if (!cleaned) {
    // Use default state (first in the list) if not provided
    // State is required in Sanity, so we need a default
    return states[0]?.value || '';
  }

  // Try to match by value
  const byValue = states.find((state) => state.value === cleaned);
  if (byValue?.value) return byValue.value;

  // Try to match by title (English)
  const byTitle = states.find((state) => state.title.toLowerCase() === cleaned);
  if (byTitle?.value) return byTitle.value;

  // Try partial match
  const partial = states.find(
    (state) =>
      cleaned.includes(state.title.toLowerCase()) ||
      state.title.toLowerCase().includes(cleaned),
  );
  if (partial?.value) return partial.value;

  // If no match found, use default state
  return states[0]?.value || '';
};

/**
 * Get value from row using column mapping
 */
function getMappedValue(
  row: ParsedRow,
  mapping: ColumnMapping,
  field: string,
): string | number | undefined {
  const columnName = mapping[field];
  if (!columnName) return undefined;
  return row[columnName];
}

/**
 * Build description with unmapped columns appended
 * Uses " & " as separator for concatenation
 */
function buildDescription(
  row: ParsedRow,
  mappedDescription: string | undefined,
  unmappedColumns: string[],
  config: ImportConfig,
): string | undefined {
  const parts: string[] = [];

  if (mappedDescription) {
    parts.push(mappedDescription);
  }

  if (config.appendUnmappedToDescription && unmappedColumns.length > 0) {
    const additionalData: string[] = [];
    for (const col of unmappedColumns) {
      const value = row[col];
      if (value !== undefined && value !== null && value !== '') {
        additionalData.push(String(value).trim());
      }
    }

    if (additionalData.length > 0) {
      const separator = config.descriptionSeparator || ' & ';
      if (parts.length > 0) {
        parts.push(separator);
      }
      parts.push(additionalData.join(' & '));
    }
  }

  const result = parts.join('').trim();
  return result || undefined;
}

/**
 * Parse images/links from a column value
 * Returns array of image URLs and array of links
 */
function parseImagesAndLinks(
  value: string | number | undefined,
): { images: string[]; links: string[] } {
  if (!value) return { images: [], links: [] };

  const str = String(value).trim();
  const items = str.split(/[,\n;]/).map((item) => item.trim()).filter(Boolean);
  
  const images: string[] = [];
  const links: string[] = [];

  for (const item of items) {
    // Check if it's an image URL/file
    if (
      /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i.test(item) ||
      /^https?:\/\/.*\.(jpg|jpeg|png|gif|webp|svg|bmp)/i.test(item) ||
      item.toLowerCase().includes('image') ||
      item.toLowerCase().includes('photo')
    ) {
      images.push(item);
    } else if (item.startsWith('http://') || item.startsWith('https://')) {
      links.push(item);
    } else {
      // If unclear, treat as link
      links.push(item);
    }
  }

  return { images, links };
}

/**
 * Convert a parsed row to a Sanity building document
 */
export async function csvDataToSanityBuilding_v2(
  row: ParsedRow,
  mapping: ColumnMapping,
  unmappedColumns: string[],
  config: ImportConfig,
): Promise<{
  building: Omit<SanityBuilding<GeopointValue>, '_id' | 'images'> & {
    _type: 'building';
    images?: Array<{
      _type: string;
      asset: {
        _type: string;
        _ref: string;
      };
    }>;
  } | null;
  errors: string[];
}> {
  const errors: string[] = [];

  // Get location (required) - handle both combined and separate fields
  // Prefer separate fields if both are available, otherwise use combined
  let lat: number | undefined;
  let lng: number | undefined;

  // First, try separate lat/lng fields (preferred)
  const latStr = getMappedValue(row, mapping, 'location.lat');
  const lngStr = getMappedValue(row, mapping, 'location.lng');
  
  if (latStr && lngStr) {
    // Both separate fields are available
    lat = normalizeCoordinate(parseNumber(latStr), 'lat');
    lng = normalizeCoordinate(parseNumber(lngStr), 'lng');
  } else {
    // Try combined location field as fallback
    const combinedLocation = getMappedValue(row, mapping, 'location.combined');
    if (combinedLocation) {
      const parsed = parseCombinedLocation(combinedLocation);
      if (parsed) {
        lat = normalizeCoordinate(parsed.lat, 'lat');
        lng = normalizeCoordinate(parsed.lng, 'lng');
      }
    } else {
      // Try to use whatever we have (one field might be missing)
      if (latStr) lat = normalizeCoordinate(parseNumber(latStr), 'lat');
      if (lngStr) lng = normalizeCoordinate(parseNumber(lngStr), 'lng');
    }
  }

  // If location is missing, try to geocode from address
  if (lat === undefined || lng === undefined) {
    // Try to get address components for geocoding
    const address = getMappedValue(row, mapping, 'address');
    const city = getMappedValue(row, mapping, 'city');
    const postcode = getMappedValue(row, mapping, 'postcode');
    const blockName = getMappedValue(row, mapping, 'blockName');

    // Build address string if we have address components
    if (address || city || postcode) {
      const addressString = buildAddressString({
        address: address ? String(address).trim() : undefined,
        city: city ? String(city).trim() : undefined,
        postcode: postcode ? String(postcode).trim() : undefined,
        blockName: blockName ? String(blockName).trim() : undefined,
        country: process.env.LANGUAGE === 'au' ? 'AU' : undefined,
      });

      if (addressString) {
        try {
          // Attempt to geocode the address
          const geocodeResult = await geocode(
            addressString,
            process.env.LANGUAGE === 'au' ? 'AU' : undefined,
          );

          if (geocodeResult) {
            lat = geocodeResult.lat;
            lng = geocodeResult.lng;
            // Log if confidence is low (optional warning)
            if (geocodeResult.confidence && geocodeResult.confidence < 0.7) {
              console.warn(
                `Low geocoding confidence (${geocodeResult.confidence}) for: ${addressString}`,
              );
            }
          }
        } catch (error) {
          console.error(`Geocoding failed for: ${addressString}`, error);
        }
      }
    }

    // If still no location after geocoding attempt, return error
    if (lat === undefined || lng === undefined) {
      errors.push(
        'Missing required location (latitude and/or longitude). Geocoding from address also failed.',
      );
      return { building: null, errors };
    }
  }

  const rescuedCoordinates = rescueLikelyNlCoordinates(lat, lng);
  if (!rescuedCoordinates) {
    errors.push('Invalid location after coordinate normalization.');
    return { building: null, errors };
  }
  lat = rescuedCoordinates.lat;
  lng = rescuedCoordinates.lng;

  const location: GeopointValue = {
    _type: 'geopoint',
    lat,
    lng,
  };

  // Get category (required) - will use default if not provided
  const categoryStr = getMappedValue(row, mapping, 'category');
  const category = parseCategory(categoryStr);
  // Category always has a value (defaults to 'övrig' if not provided)

  // Get state (required) - will use default if not provided
  const stateStr = getMappedValue(row, mapping, 'state');
  const state = parseState(stateStr);
  // State always has a value (defaults to first state if not provided)

  // If required fields are missing, return null
  // Note: location is the only field that can't have a default, so we check it above
  if (errors.length > 0) {
    return { building: null, errors };
  }

  // Get buildYear (required) - use default if not provided
  const buildYearValue = parseNumber(getMappedValue(row, mapping, 'buildYear'));
  let buildYear: number;
  if (buildYearValue !== undefined) {
    // Validate buildYear is within acceptable range (0 to current year)
    const currentYear = new Date().getFullYear();
    const year = Math.round(buildYearValue);
    if (year >= 0 && year <= currentYear) {
      buildYear = year;
    } else {
      // Invalid year, use default (current year - 50 as reasonable default)
      buildYear = currentYear - 50;
    }
  } else {
    // Missing buildYear, use default (current year - 50 as reasonable default)
    buildYear = new Date().getFullYear() - 50;
  }

  // Handle images/links columns
  const linksImagesValue = getMappedValue(row, mapping, 'linksImages');
  const imagesValue = getMappedValue(row, mapping, 'images');
  
  const descriptionParts: string[] = [];
  
  if (linksImagesValue || imagesValue) {
    const { images: imageUrls, links } = parseImagesAndLinks(
      linksImagesValue || imagesValue,
    );
    
    // Add links to description
    if (links.length > 0) {
      descriptionParts.push(links.join(' & '));
    }
    
    // Note: Image URLs will need to be uploaded separately
    // For now, we'll store them in a way that can be processed later
    // This would require additional logic to upload images to Sanity
  }

  // Calculate all optional field values
  const name = getMappedValue(row, mapping, 'name');
  const address = getMappedValue(row, mapping, 'address');
  const postcode = getMappedValue(row, mapping, 'postcode');
  const city = getMappedValue(row, mapping, 'city');
  const blockName = getMappedValue(row, mapping, 'blockName');
  const propertyDesignation = getMappedValue(
    row,
    mapping,
    'propertyDesignation',
  );
  const size = parseNumber(getMappedValue(row, mapping, 'size'));
  const architect = getMappedValue(row, mapping, 'architect');
  const propertyOwner = getMappedValue(row, mapping, 'propertyOwner');
  const demolitionYear = parseNumber(
    getMappedValue(row, mapping, 'demolitionYear'),
  );
  const demolitionCause = getMappedValue(row, mapping, 'demolitionCause');
  const sources = getMappedValue(row, mapping, 'sources');

  // Build description with unmapped columns and links
  const mappedDescription = getMappedValue(row, mapping, 'description');
  const descriptionText = mappedDescription
    ? String(mappedDescription).trim()
    : undefined;

  // Combine description, links, and unmapped columns
  const description = buildDescription(
    row,
    descriptionText,
    unmappedColumns,
    config,
  );

  // Add links from images/links column to description
  let finalDescription: string;
  if (descriptionParts.length > 0) {
    if (description) {
      finalDescription = description + ' & ' + descriptionParts.join(' & ');
    } else {
      finalDescription = descriptionParts.join(' & ');
    }
  } else {
    finalDescription = description || '';
  }

  // Build building object with all properties at once
  const building: Omit<SanityBuilding<GeopointValue>, '_id' | 'images'> & {
    _type: 'building';
    images?: Array<{
      _type: string;
      asset: {
        _type: string;
        _ref: string;
      };
    }>;
  } = {
    _type: 'building',
    location,
    category,
    state,
    buildYear,
    name: name ? String(name).trim() : '',
    address: address ? String(address).trim() : '',
    postcode: postcode ? String(postcode).trim() : '',
    city: city ? String(city).trim() : '',
    blockName: blockName ? String(blockName).trim() : '',
    propertyDesignation: propertyDesignation
      ? String(propertyDesignation).trim()
      : '',
    size: size !== undefined ? size : undefined,
    architect: architect ? String(architect).trim() : '',
    propertyOwner: propertyOwner ? String(propertyOwner).trim() : '',
    demolitionYear:
      demolitionYear !== undefined ? Math.round(demolitionYear) : undefined,
    demolitionCause: demolitionCause ? String(demolitionCause).trim() : '',
    sources: sources ? String(sources).trim() : '',
    description: finalDescription,
  };

  return { building, errors: [] };
}

