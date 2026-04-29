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
import { getRequestId, logEvent, withRequestId } from "@/lib/server/ops";

const ensureDevImportAccess = (request: NextRequest, requestId: string) => {
  if (process.env.NODE_ENV !== "development") notFound();
  const adminSecret =
    process.env.IMPORT_ADMIN_SECRET || process.env.SANITY_REVALIDATE_SECRET;
  const provided = request.headers.get("x-import-secret");
  if (!adminSecret || provided !== adminSecret) {
    logEvent("warn", "import.unauthorized", { requestId });
    return withRequestId(
      NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      requestId,
    );
  }
  return null;
};

const resolveImportImagePath = (imageFilename: string): string | null => {
  const importDirectory = path.resolve("./import-images");
  const safeFilename = path.basename(imageFilename);
  const filepath = path.resolve(importDirectory, safeFilename);
  if (!filepath.startsWith(importDirectory + path.sep)) {
    return null;
  }
  return filepath;
};

export async function POST(request: NextRequest) {
  const requestId = getRequestId(request);
  const denial = ensureDevImportAccess(request, requestId);
  if (denial) return denial;
  // get body and remove first 2 lines
  const body = stripLines(await request.text(), 2);

  if (!body)
    return withRequestId(
      NextResponse.json({ error: "Invalid body" }, { status: 400 }),
      requestId,
    );
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
        const filepath = resolveImportImagePath(imageFilename);
        if (!filepath) {
          continue;
        }
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
    logEvent("error", "import.failed", {
      requestId,
      message: e instanceof Error ? e.message : "unknown_error",
    });
    return withRequestId(
      NextResponse.json({ error: "Import failed" }, { status: 500 }),
      requestId,
    );
  }
}

export async function DELETE(request: NextRequest) {
  const requestId = getRequestId(request);
  const denial = ensureDevImportAccess(request, requestId);
  if (denial) return denial;

  // delete all uploaded content, for development only!
  const result = await client.delete({
    // query: groq`*[_type=="building" && !defined(reviewed)]`,
    query: groq`*[_type=="building" || (_type=="manifest" && _id!="manifest") || (_type=="settings" && _id!="settings") || _type=="sanity.imageAsset"]`,
  });
  return withRequestId(NextResponse.json({ deleted: result.documentIds }), requestId);
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
