interface LatLng {
  lat: number;
  lng: number;
}

interface MarkerType extends LatLng {
  id: number;
}

// interface GeoJson<T extends Record<string, unknown>> {
//   type: "Feature";
//   geometry: { type: "Point"; coordinates: [number, number] };
//   properties: T;
// }

interface SanityBuilding<T extends LatLng> {
  _id: string;
  name: string;
  description: string;
  location: T;
  state: string;
  image?: { _type: string; asset: { _type: string; _ref: string } };
}

interface FeatureBuilding {
  _id: string;
  name: string;
  description: string;
  location: LatLng;
  state: string;
  image?: string;
}
