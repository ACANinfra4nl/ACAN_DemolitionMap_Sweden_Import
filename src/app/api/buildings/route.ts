import { client } from "@/lib/sanityClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // fetch all buildings
  const buildings = await client.fetch('*[_type == "building"]');
  // transform to features
  console.log(buildings);
  // return
  return NextResponse.json(buildings);
}
