import countryPolygons from "../data/countryPolygons.json";
import type { CountrySanityLocale } from "./countrySanity";

type LngLat = [number, number];
type Ring = LngLat[];
type Polygon = Ring[];
type MultiPolygon = Polygon[];

type CountryOutline = {
  bbox: [number, number, number, number];
  polygons: MultiPolygon;
};

const OUTLINES = countryPolygons as Record<CountrySanityLocale, CountryOutline>;
const BBOX_PAD = 0.02;

const pointInRing = (lng: number, lat: number, ring: Ring): boolean => {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const crosses =
      yi > lat !== yj > lat &&
      lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
    if (crosses) inside = !inside;
  }
  return inside;
};

const pointInPolygon = (lng: number, lat: number, polygon: Polygon): boolean => {
  const [outer, ...holes] = polygon;
  if (!outer || !pointInRing(lng, lat, outer)) return false;
  return !holes.some((hole) => pointInRing(lng, lat, hole));
};

/** True when lat/lng sits inside that country's outline in `countryPolygons.json`. */
export const isPointInCountry = (
  lat: number,
  lng: number,
  country: CountrySanityLocale,
): boolean => {
  const outline = OUTLINES[country];
  if (!outline) return false;
  const [minLng, minLat, maxLng, maxLat] = outline.bbox;
  if (
    lng < minLng - BBOX_PAD ||
    lng > maxLng + BBOX_PAD ||
    lat < minLat - BBOX_PAD ||
    lat > maxLat + BBOX_PAD
  ) {
    return false;
  }
  return outline.polygons.some((polygon) => pointInPolygon(lng, lat, polygon));
};

export const isBuildingInCountry = (
  building: { location?: { lat?: number; lng?: number } },
  country: CountrySanityLocale,
): boolean => {
  const lat = building.location?.lat;
  const lng = building.location?.lng;
  if (typeof lat !== "number" || typeof lng !== "number") return false;
  return isPointInCountry(lat, lng, country);
};
