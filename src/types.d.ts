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
  siteTitle: string;
  confirmationMessage: MessageType;
  errorMessage: MessageType;
  seo: {
    description: string;
    image: SanityImageType;
  };
}

interface Dictionary {
  nav: {
    title: string;
    map: string;
    list: string;
    about: string;
    addOne: string;
    addTwo: string;
  };
  search: string;
  sort: {
    added: string;
    buildYear: string;
    demolitionYear: string;
  };
  categories: Category;
  states: States;
  newFeatureForm: NewFeatureForm;
  detailsPanel: DetailsPanel;
  notFound: string;
  building: Building;
  slugs: {
    map: string;
    list: string;
  };
  ariaLabels: {
    close: string;
    filter: string;
    previous: string;
    next: string;
    image: string;
    remove: string;
  };
}

interface Categories {
  residence: string;
  office: string;
  commercial: string;
  communityProperty: string;
  industry: string;
  other: string;
}

interface States {
  demolished: string;
  threatened: string;
  saved: string;
}

interface DetailsPanel {
  description: string;
  demolitionCause: string;
  sources: string;
  share: string;
  linkCopied: string;
  shareFailed: string;
  add: string;
}

interface NewFeatureForm {
  addLocation: string;
  addBuilding: string;
  imageInput: string;
  category: string;
  state: string;
  buildingName: string;
  address: string;
  blockName: string;
  propertyDesignation: string;
  size: string;
  architect: string;
  propertyOwner: string;
  buildYear: string;
  demolitionYear: string;
  description: string;
  demolitionCause: string;
  sources: string;
  sender: string;
  contributor: string;
  email: string;
  addEmail: string;
  accept: string;
  cancel: string;
  save: string;
}

interface Building {
  architect: string;
  size: string;
  blockName: string;
  propertyOwner: string;
  boundCO2: {
    label: string;
    unit: string;
  };
  buildYear: string;
  demolitionYear: string;
  category: string;
}
