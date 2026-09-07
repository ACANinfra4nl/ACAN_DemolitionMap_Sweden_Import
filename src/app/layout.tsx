import type { Metadata } from "next";
import "./globals.css";
import { sanityFetch } from "@/lib/sanityFetch";
import { settingsQuery } from "../../sanity/lib/queries";
import { Analytics } from "@vercel/analytics/next";
import { getDictionary } from "@/lib/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityFetch<SettingsType>({
    query: settingsQuery,
    tags: ["settings"],
  });

  if (!settings) return {};

  return {
    title: settings.siteTitle,
    description: settings.seo?.description,
    openGraph: {
      images: settings.seo?.image?.asset?.url ? [settings.seo.image.asset.url] : [],
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dict = await getDictionary();
  return (
    <html lang={dict.nav.language}>
      <body>
        {children}
        <div id="portal"></div>
        <Analytics />
      </body>
    </html>
  );
}
