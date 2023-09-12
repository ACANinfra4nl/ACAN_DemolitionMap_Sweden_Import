import { cookies, draftMode } from "next/headers";
import { redirect } from "next/navigation";

export const readToken = process.env.SANITY_READ_TOKEN;

export async function GET() {
  if (!readToken) {
    throw new Error("Missing environment variable: SANITY_READ_TOKEN");
  }
  draftMode().enable();
  cookies().set("readToken", readToken);
  redirect(`/`);
}
