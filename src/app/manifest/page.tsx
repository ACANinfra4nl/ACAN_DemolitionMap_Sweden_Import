import { Navigation } from "@/components/Navigation";
import { client } from "@/lib/sanityClient";
import { PortableText } from "@portabletext/react";
import { listItem } from "@/components/portableText/listItem";
import { list } from "@/components/portableText/list";
import { image } from "@/components/portableText/image";
import { Fragment } from "react";

export default async function ManifestPage() {
  // get data
  const data = await client.fetch(
    '*[_type=="manifest" && !(_id in path("drafts.**"))][0]'
  );
  // this should be a server component and not send any unnecessary JS to the client
  return (
    <>
      <Navigation />
      <main className="p-4">
        <h1 className="text-4xl font-bold mb-4">{data.heading}</h1>

        <PortableText
          value={data.content}
          components={{ listItem, list, types: { image } }}
        />
      </main>
    </>
  );
}
