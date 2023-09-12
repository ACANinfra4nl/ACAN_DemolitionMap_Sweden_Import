import { PortableText } from "@portabletext/react";
import { SanityDocument } from "next-sanity";
import { FC } from "react";
import { listItem } from "@/components/portableText/listItem";
import { list } from "@/components/portableText/list";
import { image } from "@/components/portableText/image";

export const Content: FC<{ data: SanityDocument<ManifestDocumentType> }> = ({
  data,
}) => (
  <div className="prose">
    <PortableText value={data.content} components={{ types: { image } }} />
  </div>
);
