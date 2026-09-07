import { groq } from "next-sanity";
import { createClient } from "@sanity/client";
import { NextRequest, NextResponse } from "next/server";
import {
  COUNTRY_DEPLOYMENTS,
  COUNTRY_SANITY_LOCALES,
  getHomeCountryCode,
  isCountrySanityLocale,
  overlayBuildingUrl,
  type CountrySanityLocale,
} from "@/lib/countrySanity";
import {
  checkRateLimit,
  getClientIp,
  getRequestId,
  logEvent,
  withRequestId,
} from "@/lib/server/ops";

const overlayBuildingsQuery = groq`*[_type == "building" && defined(location.lat) && defined(location.lng) && (reviewed == true || (reviewed != true && coalesce(map_visibility, true)))] {
  _id,
  location { lat, lng },
  state,
  category,
  name,
  city,
  demolitionYear,
  reviewed
}`;

type OverlayBuildingDoc = {
  _id: string;
  location?: { lat?: number; lng?: number };
  state?: string;
  category?: string;
  name?: string;
  city?: string;
  demolitionYear?: number;
  reviewed?: boolean;
};

const fetchCountryBuildings = async (country: CountrySanityLocale) => {
  const deployment = COUNTRY_DEPLOYMENTS[country];
  const client = createClient({
    projectId: deployment.projectId,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2023-09-01",
    useCdn: true,
    perspective: "published",
  });

  const docs = await client.fetch<OverlayBuildingDoc[]>(overlayBuildingsQuery);
  return (docs ?? []).flatMap((doc) => {
    const lat = doc.location?.lat;
    const lng = doc.location?.lng;
    if (typeof lat !== "number" || typeof lng !== "number") return [];
    if (!doc.state) return [];
    return [
      {
        _id: `${country}:${doc._id}`,
        sourceId: doc._id,
        countryCode: country,
        countryLabel: deployment.code,
        siteUrl: overlayBuildingUrl(country, doc._id),
        location: { lat, lng },
        state: doc.state,
        category: doc.category || "other",
        name: doc.name,
        city: doc.city,
        demolitionYear: doc.demolitionYear,
        reviewed: doc.reviewed === true,
      },
    ];
  });
};

export async function GET(request: NextRequest) {
  const requestId = getRequestId(request);
  const ip = getClientIp(request);
  const startedAt = Date.now();

  const rate = checkRateLimit(`global-buildings:${ip}`, 60, 60_000);
  if (!rate.allowed) {
    return withRequestId(
      NextResponse.json({ error: "Too many requests" }, { status: 429 }),
      requestId,
    );
  }

  const home = getHomeCountryCode();
  const requested = (request.nextUrl.searchParams.get("countries") ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(isCountrySanityLocale)
    .filter((country) => country !== home);

  const countries =
    requested.length > 0
      ? requested
      : COUNTRY_SANITY_LOCALES.filter((country) => country !== home);

  if (countries.length === 0) {
    return withRequestId(
      NextResponse.json({ type: "FeatureCollection", features: [] }),
      requestId,
    );
  }

  try {
    const settled = await Promise.allSettled(
      countries.map((country) => fetchCountryBuildings(country)),
    );

    const buildings = settled.flatMap((result, index) => {
      if (result.status === "fulfilled") return result.value;
      logEvent("warn", "global_buildings.country_failed", {
        requestId,
        country: countries[index],
        message:
          result.reason instanceof Error ? result.reason.message : "unknown",
      });
      return [];
    });

    const features = buildings.map((building) => ({
      type: "Feature" as const,
      geometry: {
        type: "Point" as const,
        coordinates: [building.location.lng, building.location.lat],
      },
      properties: building,
    }));

    logEvent("info", "global_buildings.fetched", {
      requestId,
      ip,
      countries,
      count: features.length,
      durationMs: Date.now() - startedAt,
    });

    return withRequestId(
      NextResponse.json({ type: "FeatureCollection", features }),
      requestId,
    );
  } catch (error) {
    logEvent("error", "global_buildings.failed", {
      requestId,
      message: error instanceof Error ? error.message : "unknown",
    });
    return withRequestId(
      NextResponse.json(
        { error: "Failed to load overlay buildings" },
        { status: 500 },
      ),
      requestId,
    );
  }
}
