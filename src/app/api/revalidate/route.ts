import { parseBody } from "next-sanity/webhook";
import { revalidateTag } from "next/cache";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

if (!process.env.SANITY_REVALIDATE_SECRET) {
  throw new Error("Missing environment variable: SANITY_REVALIDATE_SECRET");
}

export async function POST(request: NextRequest) {
  try {
    // get tag or path to revalidate from body
    const { isValidSignature, body } = await parseBody<{ _type: string }>(
      request,
      process.env.SANITY_REVALIDATE_SECRET,
    );
    if (!isValidSignature) throw new Error("Invalid signature");
    if (!body?._type) throw new Error("Invalid request: missing _type");
    // revalidate tags and/or paths
    revalidateTag(body._type);
    // return ok
    return NextResponse.json({});
  } catch (e) {
    console.error(e);
    notFound();
  }
}
