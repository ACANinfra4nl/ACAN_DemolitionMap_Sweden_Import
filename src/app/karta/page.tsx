import { MapPageContent } from "@/components/MapPageContent";
import { sanityFetch } from "@/lib/sanityFetch";
import { settingsQuery } from "../../../sanity/lib/queries";
import { Suspense } from "react";

export default async function MapPage() {
  const newBuildingTexts = await sanityFetch<SettingsType>({
    query: settingsQuery,
    tags: ["settings"],
  });
  return (
    <div className="grid h-screen grid-cols-12 grid-rows-[auto_1fr]">
      <Suspense>
        <MapPageContent {...newBuildingTexts} />
      </Suspense>
    </div>
  );
}
