import { ListPageContent } from "./ListPageContent";
import { sanityFetch } from "@/lib/sanityFetch";
import { Suspense } from "react";
import { buildingsQuery, settingsQuery } from "../../../sanity/lib/queries";
import { toFeature } from "@/lib/toFeature";
import { getDictionary } from "@/lib/dictionaries";

export const ListPage = async () => {
  const settings = await sanityFetch<SettingsType>({
    query: settingsQuery,
    tags: ["settings"],
  });
  const buildings = await sanityFetch<FeatureBuilding[]>({
    query: buildingsQuery,
    tags: ["building"],
  });
  const dict = await getDictionary();

  // transform to features
  const features = buildings.map((b) => toFeature(b, dict));

  return (
    <Suspense>
      <ListPageContent
        {...settings}
        buildings={{ type: "FeatureCollection", features }}
        dict={dict}
      />
    </Suspense>
  );
};
