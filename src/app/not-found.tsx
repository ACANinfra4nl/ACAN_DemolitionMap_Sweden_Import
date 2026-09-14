import { Navigation } from "@/components/Navigation";
import { getDictionary } from "@/lib/dictionaries";
import { sanityFetch } from "@/lib/sanityFetch";
import { getSettingsLogoUrl } from "@/lib/countryLogo";
import { settingsQuery } from "../../sanity/lib/queries";

export default async function NotFound() {
  const dict = await getDictionary();
  const settings = await sanityFetch<SettingsType>({
    query: settingsQuery,
    tags: ["settings"],
  });
  return (
    <>
      <header className="pointer-events-none">
        <Navigation dict={dict} logoUrl={getSettingsLogoUrl(settings)} />
      </header>
      <main className="mx-5">
        <div className="mt-column grid grid-cols-6 gap-10">
          <div className="acan-text-intro col-span-6 sm:col-span-4">
            <h1>{dict.notFound}</h1>
          </div>
        </div>
      </main>
    </>
  );
}
