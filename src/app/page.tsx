import { Navigation } from "@/components/Navigation";
import { SanityDocument } from "next-sanity";
import { draftMode } from "next/headers";
import PreviewProvider from "@/components/PreviewProvider";
import { Content } from "@/components/Content";
import { manifestQuery } from "../../sanity/lib/queries";
import { readToken, sanityFetch } from "@/lib/sanityFetch";
import { PreviewContent } from "@/components/PreviewContent";

export default async function ManifestPage() {
  const data = await sanityFetch<SanityDocument<ManifestDocumentType>>({
    query: manifestQuery,
  });
  const isDraftMode = draftMode().isEnabled;

  if (isDraftMode && readToken) {
    return (
      <PreviewProvider token={readToken}>
        <PreviewContent data={data} query={manifestQuery} />
      </PreviewProvider>
    );
  }

  return <Content data={data} />;
}
