import { Navigation } from "@/components/Navigation";
import { SanityDocument } from "next-sanity";
import { draftMode } from "next/headers";
import PreviewProvider from "@/components/PreviewProvider";
import { Content } from "@/components/Content";
import { manifestQuery } from "@/lib/queries";
import { readToken, sanityFetch } from "@/lib/sanityFetch";
import { PreviewContent } from "@/components/PreviewContent";

export default async function ManifestPage() {
  const data = await sanityFetch<SanityDocument<ManifestDocumentType>>({
    query: manifestQuery,
  });
  const isDraftMode = draftMode().isEnabled;

  if (isDraftMode && readToken) {
    return (
      <>
        <Navigation />
        <main className="p-4">
          <PreviewProvider token={readToken}>
            <h1 className="text-4xl font-bold mb-4">{data.heading}</h1>
            <PreviewContent data={data} query={manifestQuery} />
          </PreviewProvider>
        </main>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <main className="p-4">
        <h1 className="text-4xl font-bold mb-4">{data.heading}</h1>

        <Content data={data} />
      </main>
    </>
  );
}
