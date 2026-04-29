import { reverse } from "@/lib/reverse";
import { NextRequest, NextResponse } from "next/server";
import {
  checkRateLimit,
  getClientIp,
  getRequestId,
  logEvent,
  withRequestId,
} from "@/lib/server/ops";

export async function GET(req: NextRequest) {
  const requestId = getRequestId(req);
  const ip = getClientIp(req);
  const startedAt = Date.now();
  const rate = checkRateLimit(`reverse:${ip}`, 120, 60_000);
  if (!rate.allowed) {
    return withRequestId(
      NextResponse.json({ message: "Too many requests" }, { status: 429 }),
      requestId,
    );
  }

  const latRaw = req.nextUrl.searchParams.get("lat");
  const lngRaw = req.nextUrl.searchParams.get("lng");
  const lat = Number(latRaw);
  const lng = Number(lngRaw);
  if (
    !latRaw ||
    !lngRaw ||
    !Number.isFinite(lat) ||
    !Number.isFinite(lng) ||
    lat < -90 ||
    lat > 90 ||
    lng < -180 ||
    lng > 180
  ) {
    return withRequestId(
      NextResponse.json({ message: "Invalid parameters" }, { status: 400 }),
      requestId,
    );
  }

  const response = await reverse(lat, lng, { requestId });
  if (!response)
    return withRequestId(
      NextResponse.json({ message: "Not found" }, { status: 404 }),
      requestId,
    );
  logEvent("info", "reverse.success", {
    requestId,
    ip,
    durationMs: Date.now() - startedAt,
  });
  return withRequestId(NextResponse.json(response), requestId);
}
