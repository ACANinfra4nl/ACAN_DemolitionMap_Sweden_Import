import { NextRequest, NextResponse } from "next/server";
import { example2 } from "./example2";

export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get("lat");
  const lng = req.nextUrl.searchParams.get("lng");

  if (!lat || !lng)
    return NextResponse.json(
      { message: "Invalid parameters" },
      { status: 400 }
    );

  // TODO: is there a more efficient way of forwarding the response from fetch?
  const results = await fetch(
    `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&lang=sv&apiKey=${process.env.GEOAPIFY_TOKEN}`
  ).then((response) => response.json());
  // const result = example2.features[0];
  const result = results.features[0];
  if (!result)
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  const response: ReverseGeocodeResult = {
    address: [result.properties.street, result.properties.housenumber].join(
      " "
    ),
    postcode: result.properties.postcode,
    city: result.properties.city,
  };
  return NextResponse.json(response);
}
