import { buildingToFeature } from "@/lib/buildingToFeature";
import { client } from "@/lib/sanityClient";
import { NextRequest, NextResponse } from "next/server";
import imageUrlBuilder from "@sanity/image-url";

export async function GET(request: NextRequest) {
  // fetch all buildings
  const buildings: SanityBuilding<LatLng>[] = await client.fetch(
    `*[_type == "building"] {
        _id,
        category,
        state,
        address,
        postcode,
        city,
        blockName,
        propertyDesignation,
        size,
        boundCO2,
        architect,
        propertyOwner,
        buildYear,
        demolitionYear,
        description,
        demolitionCause,
        location { lat, lng },
        images
    }`,
    undefined,
    { perspective: "published" }
  );
  console.log(
    JSON.stringify(
      buildings.map((b) => b.images),
      null,
      2
    )
  );
  // transform to features
  const builder = imageUrlBuilder(client);
  const features = buildings.map((b) => buildingToFeature(b, builder));
  console.log(JSON.stringify(features, null, 2));

  // return
  return NextResponse.json(features);
}
