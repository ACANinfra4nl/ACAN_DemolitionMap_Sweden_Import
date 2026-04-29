import { draftMode } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  checkRateLimit,
  getClientIp,
  getRequestId,
  logEvent,
  withRequestId,
} from "@/lib/server/ops";

export async function GET(request: NextRequest) {
  const requestId = getRequestId(request);
  const ip = getClientIp(request);
  const rateKey = `preview:${ip}`;
  const rate = checkRateLimit(rateKey, 20, 60_000);
  if (!rate.allowed) {
    return withRequestId(
      NextResponse.json({ error: "Too many requests" }, { status: 429 }),
      requestId,
    );
  }
  const secret = request.nextUrl.searchParams.get("secret");
  const expectedSecret =
    process.env.SANITY_PREVIEW_SECRET || process.env.SANITY_REVALIDATE_SECRET;
  if (!expectedSecret || secret !== expectedSecret) {
    logEvent("warn", "preview.unauthorized", { requestId, ip });
    return withRequestId(
      NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      requestId,
    );
  }
  draftMode().enable();
  const slug = request.nextUrl.searchParams.get("slug") || "/";
  logEvent("info", "preview.enabled", { requestId, ip, slug });
  const redirectUrl = new URL(slug, request.nextUrl.origin);
  return withRequestId(NextResponse.redirect(redirectUrl), requestId);
}
