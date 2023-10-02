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
        <div className="sticky top-0">
          <Navigation scaleLogo />
        </div>
        <main className="p-5">
          <PreviewProvider token={readToken}>
            <h1 className="mb-4 text-4xl font-bold">{data.heading}</h1>
            <PreviewContent data={data} query={manifestQuery} />
          </PreviewProvider>
        </main>
      </>
    );
  }

  return (
    <>
      <div className="sticky top-0">
        <Navigation scaleLogo />
      </div>
      <main className="p-5">
        <h1 className="mb-4 text-4xl font-bold">{data.heading}</h1>

        <Content data={data} />
      </main>
    </>
  );
}
