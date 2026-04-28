import { client } from "@/lib/sanityClient";
import { NextRequest, NextResponse } from "next/server";
import { toFeature } from "@/lib/toFeature";
import { nanoid } from "nanoid";

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
  const imageAssets = [];
  for (const image of images) {
    if (image.size <= 0) continue;
    const imageAsset = await client.assets.upload("image", image);
    imageAssets.push({
      _type: "image",
      _key: nanoid(),
      asset: {
        _type: "reference",
        _ref: imageAsset._id,
      },
    });
  }
  return imageAssets;
};

export async function POST(request: NextRequest) {
  try {
    if (!process.env.SANITY_AUTH_TOKEN) {
      return NextResponse.json(
        {
          error:
            "Server is missing SANITY_AUTH_TOKEN. Add it to .env.local to enable submissions.",
        },
        { status: 500 },
      );
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
      typeof state === "undefined"
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: lat, lng, category, or state",
        },
        { status: 400 },
      );
    }
    if (privacyConsent !== "on") {
      return NextResponse.json(
        { error: "Privacy policy consent is required." },
        { status: 400 },
      );
    }

    // save info from form
    const formImages = formData.getAll("images") as File[];
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
      },
      { returnDocuments: true },
    );

    return NextResponse.json(toFeature(createdBuilding));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create building";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
