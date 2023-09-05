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
  name: string;
  description: string;
  location: T;
  state: string;
}
