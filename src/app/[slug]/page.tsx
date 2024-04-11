import { ListPage } from "@/components/ListPage";
import { MapPage } from "@/components/Map/MapPage";
import NotFound from "../not-found";

export function generateStaticParams() {
  return [
    { slug: "lista" },
    { slug: "liste" },
    { slug: "karta" },
    { slug: "kartta" },
    { slug: "kart" },
  ];
}

export const revalidate = 3600;

export default function SlugPage({ params }: { params: { slug: string } }) {
  switch (params.slug) {
    case "lista":
    case "liste":
      return <ListPage />;
    case "karta":
    case "kartta":
    case "kart":
      return <MapPage />;
    default:
      return <NotFound />;
  }
}
