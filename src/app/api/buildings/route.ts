import { buildingToFeature } from "@/lib/buildingToFeature";
import { client } from "@/lib/sanityClient";
import { NextRequest, NextResponse } from "next/server";
import { groq } from "next-sanity";

export async function GET(request: NextRequest) {
  // fetch all buildings
  const buildings: SanityBuilding<LatLng>[] = await client.fetch(
    groq`*[_type == "building"] {
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
    { perspective: "published", next: { tags: ["buildings"], revalidate: 600 } }
  );

  // transform to features
  const features = buildings.map((b) => buildingToFeature(b));

  // return
  return NextResponse.json(features);
}
