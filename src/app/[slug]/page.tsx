import { getDictionary } from "@/lib/dictionaries";
import dynamic from "next/dynamic";

const dict = await getDictionary();
const ListPage = dynamic(() =>
  import("@/components/List/ListPage").then((mod) => mod.ListPage),
);
const MapPage = dynamic(() =>
  import("@/components/Map/MapPage").then((mod) => mod.MapPage),
);
const NotFound = dynamic(() => import("../not-found"));

export function generateStaticParams() {
  return [{ slug: dict.slugs.list }, { slug: dict.slugs.map }];
}

export const revalidate = 3600;

export default function SlugPage({ params }: { params: { slug: string } }) {
  switch (params.slug) {
    case dict.slugs.list:
      return <ListPage />;
    case dict.slugs.map:
      return <MapPage />;
    default:
      return <NotFound />;
  }
}
