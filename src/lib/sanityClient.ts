import { createClient } from "@sanity/client";
import { resolveSanityProjectId } from "@/lib/countrySanity";

const client = createClient({
  projectId: resolveSanityProjectId(),
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_AUTH_TOKEN,
  useCdn: false,
  perspective: "published",
});

export { client };
