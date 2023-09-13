import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  console.log("revalidate api called!");
  if (
    process.env.NODE_ENV !== "development" &&
    request.headers.get("authorization") !==
      `Bearer ${process.env.REVALIDATE_TOKEN}`
  ) {
    console.warn(
      "wrong auth not in development",
      process.env.NODE_ENV,
      request.headers.get("authorization")
    );
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
