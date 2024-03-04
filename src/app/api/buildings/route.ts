import { client } from "@/lib/sanityClient";
import { NextRequest, NextResponse } from "next/server";
import { toFeature } from "@/lib/toFeature";
import { nanoid } from "nanoid";

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
  const formData = await request.formData();
  //   TODO: validate input!

  // save info from form
  const formImages = formData.getAll("images") as File[];
  const imageAssets = await uploadAssets(formImages);
  const createdBuilding = await client.create(
    {
      _type: "building",
      location: {
        _type: "geopoint",
        lat: Number(formData.get("lat")),
        lng: Number(formData.get("lng")),
      },
      // Kategori - bostad, kontor, kommersiell, samhällsfastighet, industri, övrig
      category: formData.get("category") as string,
      // Status - hotad (rivningslov), riven, räddad - färgkodad
      state: formData.get("state") as string,
      // Byggnadens namn, use `buildingName` instead of name to not trigger autocomplete
      name: formData.get("buildingName") as string | undefined,
      // Adress
      address: formData.get("address") as string | undefined,
      postcode: formData.get("postcode") as string | undefined,
      city: formData.get("city") as string | undefined,
      // Kvartersnamn
      blockName: formData.get("blockName") as string | undefined,
      // Fastighetsbeteckning
      propertyDesignation: formData.get("propertyDesignation") as
        | string
        | undefined,
      // Storlek m2
      size: formData.has("size") ? Number(formData.get("size")) : undefined,
      // (Inbunden C02)
      boundCO2: formData.has("boundCO2")
        ? Number(formData.get("boundCO2"))
        : undefined,
      // Arkitekt
      architect: formData.get("architect") as string | undefined,
      // Fastighetsägare
      propertyOwner: formData.get("propertyOwner") as string | undefined,
      // Byggår
      buildYear: Number(formData.get("buildYear")),
      // Rivningsår
      demolitionYear: formData.has("demolitionYear")
        ? Number(formData.get("demolitionYear"))
        : undefined,
      // Arkitektur, historik - fritext (nuvarande verksamhet)
      description: formData.get("description") as string | undefined,
      // Anledning till rivning, fritext (vad planeras i dess ställe)
      demolitionCause: formData.get("demolitionCause") as string | undefined,
      // (Datum för inlägget)
      // Minnen, öppet för alla att lägga till
      images: imageAssets.length > 0 ? imageAssets : undefined,
      // Avsändare
      contributor: {
        name: formData.get("contributor") as string | undefined,
        email: formData.get("contributor-email") as string | undefined,
      },
      reviewed: false,
    },
    { returnDocuments: true },
  );

  return NextResponse.json(toFeature(createdBuilding));
}
