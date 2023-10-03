import { buildingToFeature } from "@/lib/buildingToFeature";
import { client } from "@/lib/sanityClient";
import { NextRequest, NextResponse } from "next/server";
import { groq } from "next-sanity";
import { buildingsQuery } from "../../../../sanity/lib/queries";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  // fetch all buildings
  const buildings: SanityBuilding<LatLng>[] = await client.fetch(
    buildingsQuery,
    undefined,
    {
      perspective: "published",
      next: { tags: ["buildings"], revalidate: 600 },
    },
  );

  // transform to features
  const features = buildings.map((b) => buildingToFeature(b));

  // return
  return NextResponse.json(features);
}
