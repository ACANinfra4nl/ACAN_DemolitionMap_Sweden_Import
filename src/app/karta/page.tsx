import { MapPageContent } from "@/components/MapPageContent";
import { sanityFetch } from "@/lib/sanityFetch";
import { buildingsQuery, settingsQuery } from "../../../sanity/lib/queries";
import { Suspense } from "react";
import { toFeature } from "@/lib/toFeature";

export const revalidate = 3600;

export default async function MapPage() {
  const newBuildingTexts = await sanityFetch<SettingsType>({
    query: settingsQuery,
    tags: ["settings"],
  });

  const buildings = await sanityFetch<FeatureBuilding[]>({
    query: buildingsQuery,
    tags: ["building"],
  });

  // transform to features
  const features = buildings.map(toFeature);
  return (
    <div className="grid h-screen grid-cols-12 grid-rows-[auto_1fr]">
      <Suspense>
        <MapPageContent
          {...newBuildingTexts}
          buildings={{ type: "FeatureCollection", features }}
        />
      </Suspense>
    </div>
  );
}
