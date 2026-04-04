/**
 * Column mapping utilities for CSV/Excel import v2
 * Handles automatic matching of English column names to Sanity fields
 */

import { categories } from './categories';
import { states } from './states';
import type { ColumnMapping } from './importConfig';

// Sanity field names that we want to map to
export const SANITY_FIELDS = [
  'location',
  'category',
  'state',
  'name',
  'address',
  'postcode',
  'city',
  'blockName',
  'propertyDesignation',
  'size',
  'architect',
  'propertyOwner',
  'buildYear',
  'demolitionYear',
  'description',
  'demolitionCause',
  'sources',
] as const;

// Mapping patterns for each Sanity field
// Each pattern is an array of possible column name variations (case-insensitive)
const FIELD_PATTERNS: Record<string, string[]> = {
  location: ['lat', 'latitude', 'lng', 'long', 'longitude', 'lon'],
  category: ['category', 'type', 'building type', 'building category'],
  state: [
    'state',
    'status',
    'condition',
    'demolition status',
    'demolition state',
    'building status',
    'building state',
  ],
  name: ['name', 'building name', 'building', 'title', 'property name'],
  address: ['address', 'street', 'street address', 'street address line 1'],
  postcode: ['postcode', 'postal code', 'zip', 'zip code', 'post code'],
  city: ['city', 'town', 'municipality', 'locality'],
  blockName: [
    'block name',
    'block',
    'neighborhood',
    'neighbourhood',
    'quarter',
    'district',
    'area',
  ],
  propertyDesignation: [
    'property designation',
    'property id',
    'property identifier',
    'lot',
    'parcel',
  ],
  size: [
    'size',
    'area',
    'square meters',
    'square metres',
    'm2',
    'm²',
    'sqm',
    'sq m',
    'floor area',
  ],
  architect: ['architect', 'architect name', 'designer', 'designer name'],
  propertyOwner: [
    'property owner',
    'owner',
    'ownership',
    'landlord',
    'proprietor',
  ],
  buildYear: [
    'build year',
    'year built',
    'construction year',
    'year of construction',
    'built',
    'year',
  ],
  demolitionYear: [
    'demolition year',
    'year demolished',
    'year of demolition',
    'demolished',
    'demolition date',
  ],
  description: [
    'description',
    'notes',
    'story',
    'stories',
    'narrative',
    'details',
    'comments',
  ],
  demolitionCause: [
    'demolition cause',
    'reason',
    'reason for demolition',
    'background',
    'cause',
  ],
  sources: ['sources', 'source', 'references', 'reference', 'citation'],
};

/**
 * Normalize a string for comparison (lowercase, trim, remove special chars)
 */
function normalize(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ');
}

/**
 * Calculate similarity between two strings (simple Levenshtein-like)
 */
function similarity(str1: string, str2: string): number {
  const s1 = normalize(str1);
  const s2 = normalize(str2);

  if (s1 === s2) return 1.0;
  if (s1.includes(s2) || s2.includes(s1)) return 0.8;

  // Simple character overlap check
  const chars1 = new Set(s1.split(''));
  const chars2 = new Set(s2.split(''));
  const intersection = new Set([...chars1].filter((x) => chars2.has(x)));
  const union = new Set([...chars1, ...chars2]);
  return intersection.size / union.size;
}

/**
 * Find the best matching Sanity field for a given column name
 */
function findBestMatch(columnName: string): {
  field: string;
  score: number;
} | null {
  let bestMatch: { field: string; score: number } | null = null;

  for (const [field, patterns] of Object.entries(FIELD_PATTERNS)) {
    for (const pattern of patterns) {
      const score = similarity(columnName, pattern);
      if (score > 0.5) {
        // Threshold for matching
        if (!bestMatch || score > bestMatch.score) {
          bestMatch = { field, score };
        }
      }
    }
  }

  return bestMatch;
}

/**
 * Special handling for location fields (lat/lng)
 * Handles both separate columns and combined columns (e.g., "lat/ long")
 */
function findLocationFields(columnNames: string[]): {
  lat?: string;
  lng?: string;
  combined?: string;
} {
  const locationFields: { lat?: string; lng?: string; combined?: string } = {};

  for (const col of columnNames) {
    const normalized = normalize(col);
    
    // Check for combined lat/lng field (e.g., "lat/ long", "lat long", "coordinates")
    if (
      (normalized.includes('lat') && normalized.includes('long')) ||
      (normalized.includes('lat') && normalized.includes('lng')) ||
      normalized.includes('coordinates') ||
      normalized.includes('location')
    ) {
      // Check if it's a combined field by looking at sample data
      locationFields.combined = col;
    } else if (
      normalized.includes('lat') &&
      (normalized.includes('latitude') || normalized.length < 10)
    ) {
      locationFields.lat = col;
    } else if (
      (normalized.includes('lng') ||
        normalized.includes('long') ||
        normalized.includes('lon')) &&
      (normalized.includes('longitude') || normalized.length < 10)
    ) {
      locationFields.lng = col;
    }
  }

  return locationFields;
}

/**
 * Auto-detect column mappings from CSV column names
 */
export function autoDetectMappings(
  columnNames: string[],
  manualMapping?: ColumnMapping,
): ColumnMapping {
  const mappings: ColumnMapping = { ...manualMapping };

  // Handle location fields specially (need both lat and lng)
  const locationFields = findLocationFields(columnNames);
  
  // Check for combined location field first
  if (locationFields.combined) {
    mappings['location.combined'] = locationFields.combined;
  } else if (locationFields.lat && locationFields.lng) {
    mappings['location.lat'] = locationFields.lat;
    mappings['location.lng'] = locationFields.lng;
  } else if (locationFields.lat) {
    mappings['location.lat'] = locationFields.lat;
  } else if (locationFields.lng) {
    mappings['location.lng'] = locationFields.lng;
  }

  // Map other fields
  for (const columnName of columnNames) {
    // Skip if already manually mapped
    if (Object.values(mappings).includes(columnName)) {
      continue;
    }

    // Skip location columns (already handled)
    if (
      columnName === locationFields.lat ||
      columnName === locationFields.lng ||
      columnName === locationFields.combined
    ) {
      continue;
    }

    // Check for images/links columns
    const normalized = normalize(columnName);
    if (
      normalized.includes('image') ||
      normalized.includes('photo') ||
      normalized.includes('picture')
    ) {
      if (!mappings['images']) {
        mappings['images'] = columnName;
      }
      continue;
    }
    if (normalized.includes('link') && normalized.includes('image')) {
      // Combined links/images field
      if (!mappings['linksImages']) {
        mappings['linksImages'] = columnName;
      }
      continue;
    }

    const match = findBestMatch(columnName);
    if (match && match.score > 0.5) {
      // Only map if not already mapped to this field
      if (!Object.keys(mappings).includes(match.field)) {
        mappings[match.field] = columnName;
      }
    }
  }

  return mappings;
}

/**
 * Get list of unmapped columns (excludes images/links and location columns)
 */
export function getUnmappedColumns(
  columnNames: string[],
  mappings: ColumnMapping,
): string[] {
  const mappedColumns = new Set(Object.values(mappings));
  return columnNames.filter(
    (col) =>
      !mappedColumns.has(col) &&
      mappings['images'] !== col &&
      mappings['linksImages'] !== col &&
      mappings['location.combined'] !== col &&
      mappings['location.lat'] !== col &&
      mappings['location.lng'] !== col,
  );
}

/**
 * Validate that required fields are mapped
 * Note: state, category, and buildYear have defaults, so they're not strictly required
 */
export function validateRequiredMappings(
  mappings: ColumnMapping,
): string[] {
  const missing: string[] = [];

  // Check location fields (can be combined or separate)
  // Location is the only field that MUST be mapped (no default possible)
  if (!mappings['location.combined'] && !mappings['location.lat']) {
    missing.push('location.lat');
  }
  if (!mappings['location.combined'] && !mappings['location.lng']) {
    missing.push('location.lng');
  }

  // Note: category, state, and buildYear have defaults in the converter,
  // so they don't need to be mapped. We'll warn but not fail.
  // If you want to warn about missing mappings, you can add them here
  // but don't add them to the missing array to avoid failing validation.

  return missing;
}

