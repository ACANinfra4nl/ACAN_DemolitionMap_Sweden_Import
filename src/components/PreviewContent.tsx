"use client";

import { SanityDocument } from "next-sanity";
import { FC } from "react";
import { useParams } from "next/navigation";
import { useLiveQuery } from "next-sanity/preview";
import { Content } from "./Content";

export const PreviewContent: FC<{
  data: SanityDocument<ManifestDocumentType>;
  query: string;
}> = ({ data, query }) => {
  const params = useParams();
  const [liveData] = useLiveQuery(data, query);
  console.log("updated", liveData);

  return <Content data={liveData} />;
};
