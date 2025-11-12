import { getDictionary } from "@/lib/dictionaries";
import dynamic from "next/dynamic";

const ListPage = dynamic(() =>
  import("@/components/List/ListPage").then((mod) => mod.ListPage),
);
const MapPage = dynamic(() =>
  import("@/components/Map/MapPage").then((mod) => mod.MapPage),
);
const NotFound = dynamic(() => import("../not-found"));

export async function generateStaticParams() {
  const dict = await getDictionary();
  return [{ slug: dict.slugs.list }, { slug: dict.slugs.map }];
}

export default async function SlugPage({ params }: { params: { slug: string } }) {
  const dict = await getDictionary();
  
  switch (params.slug) {
    case dict.slugs.list:
      return <ListPage />;
    case dict.slugs.map:
      return <MapPage />;
    default:
      return <NotFound />;
  }
}
