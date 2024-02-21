import { ListPageContent } from "@/components/ListPageContent";
import { sanityFetch } from "@/lib/sanityFetch";
import { Suspense } from "react";
import { buildingsQuery } from "../../../sanity/lib/queries";
import { toFeature } from "@/lib/toFeature";

export const revalidate = 3600;

export default async function ListPage() {
  const buildings = await sanityFetch<FeatureBuilding[]>({
    query: buildingsQuery,
    tags: ["building"],
  });

  // transform to features
  const features = buildings.map(toFeature);
  return (
    <Suspense>
      <ListPageContent buildings={{ type: "FeatureCollection", features }} />
    </Suspense>
  );
}
