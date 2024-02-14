import { Studio } from "./Studio";
// Set the right `viewport`, `robots` and `referer` meta tags
export { metadata } from "next-sanity/studio/metadata";
export { viewport } from "next-sanity/studio/viewport";

// Ensures the Studio route is statically generated
export const dynamic = "force-static";

export default function StudioPage() {
  return <Studio />;
}
