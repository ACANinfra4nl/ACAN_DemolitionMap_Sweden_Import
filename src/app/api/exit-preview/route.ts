import { draftMode } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getRequestId, logEvent, withRequestId } from "@/lib/server/ops";

export async function GET(request: NextRequest) {
  const requestId = getRequestId(request);
  draftMode().disable();
  logEvent("info", "preview.disabled", { requestId });
  return withRequestId(NextResponse.redirect(new URL("/", request.nextUrl.origin)), requestId);
}
