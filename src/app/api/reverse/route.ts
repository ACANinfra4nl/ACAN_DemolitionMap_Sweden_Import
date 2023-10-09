import { reverse } from "@/lib/reverse";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get("lat");
  const lng = req.nextUrl.searchParams.get("lng");

  if (!lat || !lng)
    return NextResponse.json(
      { message: "Invalid parameters" },
      { status: 400 },
    );

  const response = await reverse(lat, lng);
  if (!response)
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(response);
}
