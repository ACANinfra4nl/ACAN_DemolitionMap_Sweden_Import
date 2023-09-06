"use server";

import { buildingToFeature } from "@/lib/buildingToFeature";
import { client } from "@/lib/sanityClient";
import { revalidateTag } from "next/cache";
import imageUrlBuilder from "@sanity/image-url";

export const create = async (formData: FormData) => {
  //   TODO: validate input!
  // save info from form
  const formImage = formData.get("image") as File;
  const imageAsset =
    formImage && formImage.size > 0
      ? await client.assets.upload("image", formImage)
      : undefined;
  const createdBuilding = await client.create(
    {
      _type: "building",
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      location: {
        _type: "geopoint",
        lat: Number(formData.get("lat")),
        lng: Number(formData.get("lng")),
      },
      state: "threatened", // TODO: add to form
      image: imageAsset
        ? {
            _type: "image",
            asset: {
              _type: "reference",
              _ref: imageAsset._id,
            },
          }
        : undefined,
    },
    { returnDocuments: true }
  );

  // TODO: handle errors
  // invalidate cache
  revalidateTag("buildings");
  return buildingToFeature(createdBuilding, imageUrlBuilder(client));
};
