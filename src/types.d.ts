/// <reference types="geojson" />

interface LatLng {
  lat: number;
  lng: number;
}
interface SanityImageType {
  asset: {
    url: string;
    metadata: {
      dimensions: {
        width: number;
        height: number;
      };
    };
  };
}

interface SanityBuilding<T extends LatLng> {
  _id: string;
  location: T;
  category: string;
  state: string;
  name?: string;
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
  demolitionYear?: number;
  description?: string;
  demolitionCause?: string;
  images?: SanityImageType[];
  sources?: string;
  contributor?: {
    name?: string;
    email?: string;
  };
}

interface FeatureBuilding {
  _id: string;
  _createdAt: string;
  location: LatLng;
  category: string;
  state: string;
  name?: string;
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
  demolitionYear?: number;
  description?: string;
  demolitionCause?: string;
  images?: SanityImageType[];
  sources?: string;
  contributor?: {
    name?: string;
    email?: string;
  };
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
  intro: import("sanity").PortableTextBlock[];
  content: import("sanity").PortableTextBlock[];
  // latestBuildings: SanityBuilding<LatLng>[];
}

interface MessageType {
  heading: string;
  body: import("sanity").PortableTextBlock[];
}

interface SettingsType {
  confirmationMessage: MessageType;
  errorMessage: MessageType;
  seo: {
    description: string;
    image: SanityImageType;
  };
}
