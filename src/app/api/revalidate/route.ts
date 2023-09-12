import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  if (
    request.headers.get("authorization") !==
    `Bearer ${process.env.REVALIDATE_TOKEN}`
  ) {
    return NextResponse.json({}, { status: 404 });
  }

  const path = request.nextUrl.searchParams.get("path");
  if (path) {
    revalidatePath(path);
  }
  const tag = request.nextUrl.searchParams.get("tag");
  if (tag) {
    revalidateTag(tag);
  }

  return NextResponse.json({});
}
