import { ListPageContent } from "@/components/ListPageContent";
import { sanityFetch } from "@/lib/sanityFetch";
import { Suspense } from "react";
import { buildingsQuery } from "../../sanity/lib/queries";
import { toFeature } from "@/lib/toFeature";
import { getDictionary } from "@/lib/dictionaries";

export const ListPage = async () => {
  const buildings = await sanityFetch<FeatureBuilding[]>({
    query: buildingsQuery,
    tags: ["building"],
  });

  // transform to features
  const features = buildings.map(toFeature);

  const dict = await getDictionary();
  return (
    <Suspense>
      <ListPageContent
        buildings={{ type: "FeatureCollection", features }}
        dict={dict}
      />
    </Suspense>
  );
};
