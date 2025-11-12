import { SanityDocument } from "next-sanity";
import { draftMode } from "next/headers";
import PreviewProvider from "@/components/PreviewProvider";
import { manifestQuery } from "../../sanity/lib/queries";
import { readToken, sanityFetch } from "@/lib/sanityFetch";
import { ManifestPageContent } from "@/components/ManifestPageContent";
import { PreviewManifestPageContent } from "@/components/PreviewManifestPageContent";
import { getDictionary } from "@/lib/dictionaries";

export default async function ManifestPage() {
  const data = await sanityFetch<SanityDocument<ManifestDocumentType> | null>({
    query: manifestQuery,
    tags: ["manifest"],
  });
  const isDraftMode = draftMode().isEnabled;
  const dict = await getDictionary();

  if (!data) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Setup Required</h1>
        <p className="mb-4">
          The manifest document has not been created yet. Please create it in Sanity Studio.
        </p>
        <p className="text-sm text-gray-600">
          If you just created the documents, try restarting the dev server or wait a few seconds for the cache to clear.
        </p>
      </div>
    );
  }

  if (isDraftMode && readToken) {
    return (
      <PreviewProvider token={readToken}>
        <PreviewManifestPageContent
          data={data}
          query={manifestQuery}
          dict={dict}
        />
      </PreviewProvider>
    );
  }

  return <ManifestPageContent data={data} dict={dict} />;
}
