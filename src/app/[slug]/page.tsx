import { ListPage } from "@/components/List/ListPage";
import { MapPage } from "@/components/Map/MapPage";
import NotFound from "../not-found";
import { getDictionary } from "@/lib/dictionaries";

const dict = await getDictionary();

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
