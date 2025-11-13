import { parseBody } from "next-sanity/webhook";
import { revalidateTag, revalidatePath } from "next/cache";
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
    if (!isValidSignature) {
      console.error("Invalid webhook signature");
      throw new Error("Invalid signature");
    }
    if (!body?._type) {
      console.error("Missing _type in webhook body:", body);
      throw new Error("Invalid request: missing _type");
    }
    
    const documentType = body._type;
    console.log(`Revalidating cache for document type: ${documentType}`);
    
    // Revalidate the tag
    revalidateTag(documentType);
    
    // Also revalidate the relevant pages
    if (documentType === "building") {
      revalidatePath("/", "layout");
      revalidatePath("/map", "page");
      revalidatePath("/list", "page");
      console.log("Revalidated building pages");
    } else if (documentType === "manifest" || documentType === "settings") {
      revalidatePath("/", "page");
      revalidatePath("/map", "page");
      revalidatePath("/list", "page");
      console.log(`Revalidated pages for ${documentType}`);
    }
    
    return NextResponse.json({ 
      revalidated: true, 
      tag: documentType,
      timestamp: new Date().toISOString()
    });
  } catch (e) {
    console.error("Revalidation error:", e);
    return NextResponse.json(
      { error: "Revalidation failed", message: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}
