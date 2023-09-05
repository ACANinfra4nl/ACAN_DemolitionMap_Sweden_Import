import { buildingToFeature } from "@/lib/buildingToFeature";
import { client } from "@/lib/sanityClient";
import { NextRequest, NextResponse } from "next/server";
import imageUrlBuilder from "@sanity/image-url";

export async function GET(request: NextRequest) {
  // fetch all buildings
  const buildings: SanityBuilding<LatLng>[] =
    await client.fetch(`*[_type == "building"] {
        _id,
        name,
        description,
        state,
        location,
        image
    }`);

  // transform to features
  const builder = imageUrlBuilder(client);
  const features = buildings.map((b) => buildingToFeature(b, builder));
  console.log(features);

  // return
  return NextResponse.json(features);
}
