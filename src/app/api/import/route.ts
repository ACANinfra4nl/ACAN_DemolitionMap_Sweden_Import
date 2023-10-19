import { NextRequest, NextResponse } from "next/server";
import { client } from "@/lib/sanityClient";
import * as papa from "papaparse";
import { CsvRow, csvDataToSanityBuilding } from "@/lib/csvDataToSanityBuilding";
import { stripLines } from "../../../lib/stripLines";
import { notFound } from "next/navigation";
import { groq } from "next-sanity";
import { reverse } from "@/lib/reverse";
import { wait } from "@/lib/wait";
import fs from "node:fs/promises";
import path from "node:path";
import { nanoid } from "nanoid";

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV !== "development") notFound();
  // get body and remove first 2 lines
  const body = stripLines(await request.text(), 2);

  if (!body)
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  try {
    // parse posted csv
    const parsedBody = papa.parse<CsvRow>(body, {
      header: true,
      delimiter: ",",
    });

    const allCreated = [];
    for (const row of parsedBody.data) {
      // convert csv to sanity model
      const building = csvDataToSanityBuilding(row);
      if (!building) continue;
      const addressData = await reverse(
        building.location.lat,
        building.location.lng,
      );
      const createBuilding = addressData
        ? Object.assign({}, building, addressData)
        : building;
      // find the matching image
      const imageFilename = row.BILD.trim();
      if (imageFilename) {
        const filepath = path.resolve("./import-images", imageFilename);
        try {
          await fs.stat(filepath);
          // file exists, read it and upload to sanity
          const filebuffer = await fs.readFile(filepath);
          const imageAsset = await uploadAsset(filebuffer, imageFilename);
          createBuilding.images = [imageAsset];
        } catch {
          // file does not exist, ignore
          console.warn("could not find file", filepath);
        }
      }

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
    query: groq`*[_type=="building" || (_type=="manifest" && _id!="manifest") || (_type=="settings" && _id!="settings") || _type=="sanity.imageAsset"]`,
  });
  return NextResponse.json({ deleted: result.documentIds });
}

const uploadAsset = async (image: Buffer, filename: string) => {
  const imageAsset = await client.assets.upload("image", image, { filename });
  return {
    _type: "image",
    _key: nanoid(),
    asset: {
      _type: "reference",
      _ref: imageAsset._id,
    },
  };
};
