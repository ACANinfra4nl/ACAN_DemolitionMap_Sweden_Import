import { parseBody } from "next-sanity/webhook";
import { revalidateTag } from "next/cache";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    console.error("Missing environment variable: SANITY_REVALIDATE_SECRET");
    return NextResponse.json(
      { error: "Server misconfiguration" },
      { status: 500 },
    );
  }

  try {
    const { isValidSignature, body } = await parseBody<{ _type: string }>(
      request,
      secret,
    );
    if (!isValidSignature) throw new Error("Invalid signature");
    if (!body?._type) throw new Error("Invalid request: missing _type");
    revalidateTag(body._type);
    return NextResponse.json({});
  } catch (e) {
    console.error(e);
    notFound();
  }
}
