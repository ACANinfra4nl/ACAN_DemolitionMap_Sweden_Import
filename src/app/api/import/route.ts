import { NextRequest, NextResponse } from "next/server";
import { client } from "@/lib/sanityClient";
import * as papa from "papaparse";
import { csvDataToSanityBuilding } from "@/lib/csvDataToSanityBuilding";
import { stripLines } from "../../../lib/stripLines";
import { notFound } from "next/navigation";
import { groq } from "next-sanity";
import { reverse } from "@/lib/reverse";
import { wait } from "@/lib/wait";

export async function POST(request: NextRequest) {
  // TODO: check auth token
  // get body and remove first 2 lines
  const body = stripLines(await request.text(), 2);

  if (!body)
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  try {
    // parse posted csv
    const parsedBody = papa.parse(body, { header: true });
    // convert csv to sanity models
    const buildings = parsedBody.data.map((data) =>
      csvDataToSanityBuilding(data as Record<string, string>),
    );
    const allCreated = [];
    for (const building of buildings) {
      if (!building) continue;
      const addressData = await reverse(
        building.location.lat,
        building.location.lng,
      );
      const createBuilding = addressData
        ? Object.assign({}, building, addressData)
        : building;
      const created = await client.create(createBuilding);
      allCreated.push(created);
      await wait(1000 / 5); // at most 5/sec
    }

    return NextResponse.json(allCreated);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: (e as Error).toString() },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  // delete all uploaded content, for development only!
  const result = await client.delete({
    // query: groq`*[_type=="building" && !defined(reviewed)]`,
    query: groq`*[_type=="building" || (_type=="manifest" && _id!="manifest") || (_type=="settings" && _id!="settings")]`,
  });
  return NextResponse.json({ deleted: result.documentIds });
}
