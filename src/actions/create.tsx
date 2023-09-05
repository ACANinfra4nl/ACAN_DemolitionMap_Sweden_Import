"use server";

import { buildingToFeature } from "@/lib/buildingToFeature";
import { client } from "@/lib/sanityClient";
import { revalidateTag } from "next/cache";

export const create = async (formData: FormData) => {
  //   TODO: validate input!
  // save info from form
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
    },
    { returnDocuments: true }
  );
  // TODO: handle errors
  // invalidate cache
  revalidateTag("buildings");
  return buildingToFeature(createdBuilding);
};
