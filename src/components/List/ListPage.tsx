import { ListPageContent } from "./ListPageContent";
import { sanityFetch } from "@/lib/sanityFetch";
import { Suspense } from "react";
import { buildingsListQuery, settingsQuery } from "../../../sanity/lib/queries";
import { toFeature } from "@/lib/toFeature";
import { getDictionary } from "@/lib/dictionaries";
import { getHomeCountryCode } from "@/lib/countrySanity";
import { isBuildingInCountry } from "@/lib/pointInCountry";
import { getSettingsLogoUrl } from "@/lib/countryLogo";

export const ListPage = async () => {
  const settings = await sanityFetch<SettingsType>({
    query: settingsQuery,
    tags: ["settings"],
  });
  const buildings = await sanityFetch<FeatureBuilding[]>({
    query: buildingsListQuery,
    tags: ["building"],
  });
  const dict = await getDictionary();
  const homeCountry = getHomeCountryCode();
  const visible = homeCountry
    ? buildings.filter((building) => isBuildingInCountry(building, homeCountry))
    : buildings;

  const features = visible.map((b) => toFeature(b, dict));

  return (
    <Suspense>
      <ListPageContent
        {...settings}
        buildings={{ type: "FeatureCollection", features }}
        dict={dict}
        logoUrl={getSettingsLogoUrl(settings)}
      />
    </Suspense>
  );
};
