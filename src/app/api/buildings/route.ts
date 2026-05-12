import { client } from "@/lib/sanityClient";
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { toFeature } from "@/lib/toFeature";
import { nanoid } from "nanoid";
import {
  checkRateLimit,
  getClientIp,
  getRequestId,
  logEvent,
  mapWithConcurrency,
  withRequestId,
} from "@/lib/server/ops";

const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024;
const MAX_TOTAL_IMAGE_BYTES = 20 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

const getOptionalString = (formData: FormData, key: string) => {
  const value = formData.get(key);
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const getOptionalNumber = (formData: FormData, key: string) => {
  const value = getOptionalString(formData, key);
  if (typeof value === "undefined") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const uploadAssets = async (images: File[]) => {
  const uploaded = await mapWithConcurrency(images, 2, async (image) => {
    if (image.size <= 0) return null;
    const imageAsset = await client.assets.upload("image", image);
    return {
      _type: "image",
      _key: nanoid(),
      asset: {
        _type: "reference",
        _ref: imageAsset._id,
      },
    };
  });
  return uploaded.filter((item): item is NonNullable<typeof item> => Boolean(item));
};

const isValidLatLng = (lat: number, lng: number) =>
  lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;

export async function POST(request: NextRequest) {
  const requestId = getRequestId(request);
  const ip = getClientIp(request);
  const startedAt = Date.now();
  try {
    const rate = checkRateLimit(`buildings:${ip}`, 30, 60_000);
    if (!rate.allowed) {
      return withRequestId(
        NextResponse.json({ error: "Too many requests" }, { status: 429 }),
        requestId,
      );
    }

    if (!process.env.SANITY_AUTH_TOKEN) {
      logEvent("error", "buildings.missing_token", { requestId });
      return withRequestId(
        NextResponse.json(
          {
            error:
              "Server is missing SANITY_AUTH_TOKEN. Add it to .env.local to enable submissions.",
          },
          { status: 500 },
        ),
        requestId,
      );
    }

    const origin = request.headers.get("origin");
    if (origin) {
      try {
        const originHost = new URL(origin).host;
        const requestHost = request.headers.get("host");
        if (requestHost && originHost !== requestHost) {
          logEvent("warn", "buildings.origin_mismatch", {
            requestId,
            ip,
            originHost,
            requestHost,
          });
          return withRequestId(
            NextResponse.json({ error: "Invalid origin" }, { status: 403 }),
            requestId,
          );
        }
      } catch {
        return withRequestId(
          NextResponse.json({ error: "Invalid origin header" }, { status: 400 }),
          requestId,
        );
      }
    }

    const formData = await request.formData();
    const lat = getOptionalNumber(formData, "lat");
    const lng = getOptionalNumber(formData, "lng");
    const buildYear = getOptionalNumber(formData, "buildYear");
    const category = getOptionalString(formData, "category");
    const state = getOptionalString(formData, "state");
    const privacyConsent = getOptionalString(formData, "privacyConsent");
    if (
      typeof lat === "undefined" ||
      typeof lng === "undefined" ||
      typeof category === "undefined" ||
      typeof state === "undefined" ||
      !isValidLatLng(lat, lng)
    ) {
      return withRequestId(
        NextResponse.json(
          {
            error:
              "Missing or invalid required fields: lat, lng, category, or state",
          },
          { status: 400 },
        ),
        requestId,
      );
    }
    if (privacyConsent !== "on") {
      return withRequestId(
        NextResponse.json(
          { error: "Privacy policy consent is required." },
          { status: 400 },
        ),
        requestId,
      );
    }

    // save info from form (omit empty entries from multipart parsing)
    const rawImages = formData.getAll("images") as File[];
    const formImages = rawImages.filter((f) => f instanceof File && f.size > 0);
    if (formImages.length === 0) {
      return withRequestId(
        NextResponse.json(
          { error: "At least one image is required." },
          { status: 400 },
        ),
        requestId,
      );
    }
    if (formImages.length > MAX_IMAGES) {
      return withRequestId(
        NextResponse.json(
          { error: `A maximum of ${MAX_IMAGES} images is allowed.` },
          { status: 400 },
        ),
        requestId,
      );
    }

    let totalImageSize = 0;
    for (const file of formImages) {
      if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
        return withRequestId(
          NextResponse.json(
            { error: "Unsupported file type uploaded." },
            { status: 400 },
          ),
          requestId,
        );
      }
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        return withRequestId(
          NextResponse.json(
            { error: "One or more images exceed the file size limit." },
            { status: 400 },
          ),
          requestId,
        );
      }
      totalImageSize += file.size;
    }
    if (totalImageSize > MAX_TOTAL_IMAGE_BYTES) {
      return withRequestId(
        NextResponse.json(
          { error: "Total image payload exceeds upload limit." },
          { status: 400 },
        ),
        requestId,
      );
    }

    const imageAssets = await uploadAssets(formImages);
    const createdBuilding = await client.create(
        {
        _type: "building",
        location: {
          _type: "geopoint",
          lat,
          lng,
        },
        // Kategori - bostad, kontor, kommersiell, samhällsfastighet, industri, övrig
        category,
        // Status - hotad (rivningslov), riven, räddad - färgkodad
        state,
        // Byggnadens namn, use `buildingName` instead of name to not trigger autocomplete
        name: getOptionalString(formData, "buildingName"),
        // Adress
        address: getOptionalString(formData, "address"),
        postcode: getOptionalString(formData, "postcode"),
        city: getOptionalString(formData, "city"),
        // Kvartersnamn
        blockName: getOptionalString(formData, "blockName"),
        // Fastighetsbeteckning
        propertyDesignation: getOptionalString(formData, "propertyDesignation"),
        // Storlek m2
        size: getOptionalNumber(formData, "size"),
        // (Inbunden C02)
        boundCO2: getOptionalNumber(formData, "boundCO2"),
        // Arkitekt
        architect: getOptionalString(formData, "architect"),
        // Fastighetsägare
        propertyOwner: getOptionalString(formData, "propertyOwner"),
        // Byggår
        buildYear,
        // Rivningsår
        demolitionYear: getOptionalNumber(formData, "demolitionYear"),
        // Arkitektur, historik - fritext (nuvarande verksamhet)
        description: getOptionalString(formData, "description"),
        // Anledning till rivning, fritext (vad planeras i dess ställe)
        demolitionCause: getOptionalString(formData, "demolitionCause"),
        // Bildkällor
        sources: getOptionalString(formData, "sources"),
        // (Datum för inlägget)
        // Minnen, öppet för alla att lägga till
        images: imageAssets.length > 0 ? imageAssets : undefined,
        // Avsändare
        contributor: {
          name: getOptionalString(formData, "contributor"),
          email: getOptionalString(formData, "contributor-email"),
        },
        reviewed: false,
        map_visibility: true,
      },
      { returnDocuments: true },
    );
    revalidateTag("building");
    logEvent("info", "buildings.created", {
      requestId,
      ip,
      durationMs: Date.now() - startedAt,
      imageCount: imageAssets.length,
      id: createdBuilding._id,
    });
    return withRequestId(NextResponse.json(toFeature(createdBuilding)), requestId);
  } catch (error) {
    logEvent("error", "buildings.create_failed", {
      requestId,
      ip,
      durationMs: Date.now() - startedAt,
      message: error instanceof Error ? error.message : "unknown_error",
    });
    return withRequestId(
      NextResponse.json({ error: "Failed to create building" }, { status: 500 }),
      requestId,
    );
  }
}
