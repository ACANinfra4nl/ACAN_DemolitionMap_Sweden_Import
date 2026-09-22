import { MapPageContent } from "@/components/MapPageContent";
import { sanityFetch } from "@/lib/sanityFetch";
import { buildingsMapQuery, settingsQuery } from "../../../sanity/lib/queries";
import { Suspense } from "react";
import { toFeature } from "@/lib/toFeature";
import { getDictionary } from "@/lib/dictionaries";
import { getHomeCountryCode } from "@/lib/countrySanity";
import { isBuildingInCountry } from "@/lib/pointInCountry";
import { getSettingsLogoUrl } from "@/lib/countryLogo";

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
  const homeCountry = getHomeCountryCode();
  const visible = homeCountry
    ? buildings.filter((building) => isBuildingInCountry(building, homeCountry))
    : buildings;

  const features = visible
    .filter(
      (building) =>
        typeof building.location?.lat === "number" &&
        typeof building.location?.lng === "number",
    )
    .map((b) => toFeature(b, dict));
  return (
    <div className="grid h-screen grid-cols-12 grid-rows-[auto_1fr]">
      <Suspense>
        <MapPageContent
          {...settings}
          buildings={{ type: "FeatureCollection", features }}
          dict={dict}
          countryCode={homeCountry}
          logoUrl={getSettingsLogoUrl(settings)}
        />
      </Suspense>
    </div>
  );
};
