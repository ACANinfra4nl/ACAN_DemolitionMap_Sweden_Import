export const ADD_BUILDING_DRAFT_KEY = "demolition-map-add-building-draft";

export type AddBuildingDraftPayload = {
  lat: number;
  lng: number;
  fields: Record<string, string>;
  hadImages: boolean;
};

export function loadAddBuildingDraft(latLng: LatLng): {
  fields: Record<string, string>;
  hadImages: boolean;
} {
  if (typeof window === "undefined") {
    return { fields: {}, hadImages: false };
  }
  try {
    const raw = sessionStorage.getItem(ADD_BUILDING_DRAFT_KEY);
    if (!raw) return { fields: {}, hadImages: false };
    const data = JSON.parse(raw) as Partial<AddBuildingDraftPayload>;
    if (
      typeof data.lat !== "number" ||
      typeof data.lng !== "number" ||
      typeof data.fields !== "object" ||
      !data.fields
    ) {
      return { fields: {}, hadImages: false };
    }
    if (
      Math.abs(data.lat - latLng.lat) > 1e-6 ||
      Math.abs(data.lng - latLng.lng) > 1e-6
    ) {
      return { fields: {}, hadImages: false };
    }
    return {
      fields: data.fields,
      hadImages: Boolean(data.hadImages),
    };
  } catch {
    return { fields: {}, hadImages: false };
  }
}

export function persistAddBuildingDraft(
  form: HTMLFormElement,
  hadImages: boolean,
): void {
  if (typeof window === "undefined") return;
  try {
    const fd = new FormData(form);
    const fields: Record<string, string> = {};
    for (const [k, v] of fd.entries()) {
      if (k === "images" || k === "privacyConsent") continue;
      if (typeof v === "string") fields[k] = v;
    }
    const lat = Number(fd.get("lat"));
    const lng = Number(fd.get("lng"));
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
    const payload: AddBuildingDraftPayload = {
      lat,
      lng,
      fields,
      hadImages,
    };
    sessionStorage.setItem(ADD_BUILDING_DRAFT_KEY, JSON.stringify(payload));
  } catch {
    // ignore quota / private mode
  }
}

export function clearAddBuildingDraft(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(ADD_BUILDING_DRAFT_KEY);
  } catch {
    // ignore
  }
}
