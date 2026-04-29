import { parseBody } from "next-sanity/webhook";
import { revalidateTag } from "next/cache";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { getRequestId, logEvent, withRequestId } from "@/lib/server/ops";

export async function POST(request: NextRequest) {
  const requestId = getRequestId(request);
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    logEvent("error", "revalidate.missing_secret", { requestId });
    return withRequestId(
      NextResponse.json({ error: "Server misconfiguration" }, { status: 500 }),
      requestId,
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
    logEvent("info", "revalidate.success", { requestId, tag: body._type });
    return withRequestId(NextResponse.json({}), requestId);
  } catch (e) {
    logEvent("warn", "revalidate.failed", {
      requestId,
      message: e instanceof Error ? e.message : "unknown_error",
    });
    notFound();
  }
}
