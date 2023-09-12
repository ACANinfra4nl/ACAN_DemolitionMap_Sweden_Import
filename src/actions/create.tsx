"use server";

import { buildingToFeature } from "@/lib/buildingToFeature";
import { client } from "@/lib/sanityClient";
import { randomUUID } from "crypto";

const uploadAssets = async (images: File[]) => {
  const imageAssets = [];
  for (const image of images) {
    if (image.size <= 0) continue;
    const imageAsset = await client.assets.upload("image", image);
    imageAssets.push({
      _type: "image",
      asset: {
        _type: "reference",
        _ref: imageAsset._id,
        url: imageAsset.url,
      },
    });
  }
  return imageAssets;
};

export const create = async (formData: FormData) => {
  //   TODO: validate input!
  // save info from form
  const formImages = formData.getAll("images") as File[];
  const imageAssets = await uploadAssets(formImages);
  const id = randomUUID();
  const createdBuilding = await client.create(
    {
      _id: `draft.${id}`,
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
      demolitionYear: Number(formData.get("demolitionYear")),
      // Arkitektur, historik - fritext (nuvarande verksamhet)
      description: formData.get("description") as string | undefined,
      // Anledning till rivning, fritext (vad planeras i dess ställe)
      demolitionCause: formData.get("demolitionCause") as string | undefined,
      // (Datum för inlägget)
      // Minnen, öppet för alla att lägga till
      images: imageAssets.length > 0 ? imageAssets : undefined,
    },
    { returnDocuments: true }
  );

  // TODO: handle errors
  // invalidate cache
  // revalidateTag("buildings"); // not needed when creating drafts
  return buildingToFeature(createdBuilding);
};
