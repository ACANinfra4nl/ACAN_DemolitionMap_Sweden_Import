import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * Manual revalidation endpoint
 * Use this to manually trigger cache revalidation
 * 
 * Usage:
 * POST /api/revalidate-manual?tag=building
 * or
 * POST /api/revalidate-manual with body: { tag: "building" }
 */
export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tag = searchParams.get("tag");

    if (!tag) {
      // Try to get from body
      const body = await request.json().catch(() => ({}));
      const bodyTag = body.tag;
      
      if (!bodyTag) {
        return NextResponse.json(
          { error: "Missing tag parameter. Use ?tag=building or { tag: 'building' } in body" },
          { status: 400 }
        );
      }
      
      revalidateTag(bodyTag);
      return NextResponse.json({ revalidated: true, tag: bodyTag, now: Date.now() });
    }

    revalidateTag(tag);
    return NextResponse.json({ revalidated: true, tag, now: Date.now() });
  } catch (e) {
    console.error("Revalidation error:", e);
    return NextResponse.json(
      { error: "Error revalidating", message: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}

