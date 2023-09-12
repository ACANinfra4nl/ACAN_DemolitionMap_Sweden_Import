"use client";
import { PortableText } from "@portabletext/react";
import { SanityDocument } from "next-sanity";
import { FC } from "react";
import { listItem } from "@/components/portableText/listItem";
import { list } from "@/components/portableText/list";
import { image } from "@/components/portableText/image";
import { useParams } from "next/navigation";
import { useLiveQuery } from "next-sanity/preview";

export const PreviewContent: FC<{
  data: SanityDocument<ManifestDocumentType>;
  query: string;
}> = ({ data, query }) => {
  const params = useParams();
  const [liveData] = useLiveQuery(data, query);
  console.log("updated", liveData);

  return (
    <div className="prose">
      <PortableText
        value={liveData.content}
        components={{ types: { image } }}
      />
    </div>
  );
};
