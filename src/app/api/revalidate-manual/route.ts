import { revalidateTag, revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * Manual revalidation endpoint
 * Use this to manually trigger cache revalidation
 * 
 * Usage:
 * GET /api/revalidate-manual?tag=building
 * POST /api/revalidate-manual?tag=building
 * POST /api/revalidate-manual with body: { tag: "building" }
 */
export async function GET(request: NextRequest) {
  return handleRevalidation(request);
}

export async function POST(request: NextRequest) {
  return handleRevalidation(request);
}

async function handleRevalidation(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    let tag = searchParams.get("tag");

    if (!tag) {
      // Try to get from body
      try {
        const body = await request.json();
        tag = body.tag;
      } catch {
        // Body parsing failed, that's ok
      }
    }

    if (!tag) {
      return NextResponse.json(
        { 
          error: "Missing tag parameter", 
          usage: "Use ?tag=building or POST with { tag: 'building' } in body",
          availableTags: ["building", "settings", "manifest"]
        },
        { status: 400 }
      );
    }

    console.log(`Manual revalidation triggered for tag: ${tag}`);
    
    // Revalidate the tag
    revalidateTag(tag);
    
    // Also revalidate the relevant pages
    if (tag === "building") {
      revalidatePath("/", "layout");
      revalidatePath("/map", "page");
      revalidatePath("/list", "page");
      console.log("Revalidated building pages");
    } else if (tag === "manifest" || tag === "settings") {
      revalidatePath("/", "page");
      revalidatePath("/map", "page");
      revalidatePath("/list", "page");
      console.log(`Revalidated pages for ${tag}`);
    }
    
    return NextResponse.json({ 
      revalidated: true, 
      tag,
      timestamp: new Date().toISOString(),
      message: `Cache revalidated for ${tag}. Pages should update within a few seconds.`
    });
  } catch (e) {
    console.error("Revalidation error:", e);
    return NextResponse.json(
      { error: "Error revalidating", message: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}

