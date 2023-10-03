/// <reference types="geojson" />

interface LatLng {
  lat: number;
  lng: number;
}

interface SanityBuilding<T extends LatLng> {
  _id: string;
  location: T;
  category: string;
  state: string;
  address?: string;
  postcode?: string;
  city?: string;
  blockName?: string;
  propertyDesignation?: string;
  size?: number;
  boundCO2?: number;
  architect?: string;
  propertyOwner?: string;
  buildYear: number;
  demolitionYear: number;
  description?: string;
  demolitionCause?: string;
  images?: {
    _type: string;
    asset: { _type: string; _ref: string; url?: string };
  }[];
}

interface FeatureBuilding {
  _id: string;
  location: LatLng;
  category: string;
  state: string;
  address?: string;
  postcode?: string;
  city?: string;
  blockName?: string;
  propertyDesignation?: string;
  size?: number;
  boundCO2?: number;
  architect?: string;
  propertyOwner?: string;
  buildYear: number;
  demolitionYear: number;
  description?: string;
  demolitionCause?: string;
  images?: string[];
}

interface ReverseGeocodeResult {
  address: string;
  postcode: string;
  city: string;
}

type BuildingFeature = GeoJSON.Feature<GeoJSON.Point, FeatureBuilding>;
type BuildingCollection = GeoJSON.FeatureCollection<
  GeoJSON.Point,
  FeatureBuilding
>;

interface ManifestDocumentType {
  heading: string;
  intro: string;
  content: import("sanity").PortableTextBlock[];
  latestBuildings: SanityBuilding<LatLng>[];
}
