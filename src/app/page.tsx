import { SanityDocument } from "next-sanity";
import { draftMode } from "next/headers";
import PreviewProvider from "@/components/PreviewProvider";
import { ManifestPageContent } from "@/components/ManifestPageContent";
import { manifestQuery } from "../../sanity/lib/queries";
import { readToken, sanityFetch } from "@/lib/sanityFetch";
import { PreviewManifestPageContent } from "@/components/PreviewManifestPageContent";

export default async function ManifestPage() {
  const data = await sanityFetch<SanityDocument<ManifestDocumentType>>({
    query: manifestQuery,
  });
  const isDraftMode = draftMode().isEnabled;

  if (isDraftMode && readToken) {
    return (
      <PreviewProvider token={readToken}>
        <PreviewManifestPageContent data={data} query={manifestQuery} />
      </PreviewProvider>
    );
  }

  return <ManifestPageContent data={data} />;
}
