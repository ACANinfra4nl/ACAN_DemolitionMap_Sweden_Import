"use client";

import { SanityDocument } from "next-sanity";
import { FC } from "react";
import { useParams } from "next/navigation";
import { useLiveQuery } from "next-sanity/preview";
import { ManifestPageContent } from "./ManifestPageContent";

export const PreviewManifestPageContent: FC<{
  data: SanityDocument<ManifestDocumentType>;
  query: string;
}> = ({ data, query }) => {
  const params = useParams();
  const [liveData] = useLiveQuery(data, query);

  return <ManifestPageContent data={liveData} />;
};
