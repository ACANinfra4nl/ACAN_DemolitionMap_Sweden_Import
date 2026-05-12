import { MapPageContent } from "@/components/MapPageContent";
import { sanityFetch } from "@/lib/sanityFetch";
import { buildingsMapQuery, settingsQuery } from "../../../sanity/lib/queries";
import { Suspense } from "react";
import { toFeature } from "@/lib/toFeature";
import { getDictionary } from "@/lib/dictionaries";

export const MapPage = async () => {
  const settings = await sanityFetch<SettingsType>({
    query: settingsQuery,
    tags: ["settings"],
  });

  const buildings = await sanityFetch<FeatureBuilding[]>({
    query: buildingsMapQuery,
    tags: ["building"],
  });

  const dict = await getDictionary();

  // transform to features
  const features = buildings.map((b) => toFeature(b, dict));
  return (
    <div className="grid h-screen grid-cols-12 grid-rows-[auto_1fr]">
      <Suspense>
        <MapPageContent
          {...settings}
          buildings={{ type: "FeatureCollection", features }}
          dict={dict}
        />
      </Suspense>
    </div>
  );
};
