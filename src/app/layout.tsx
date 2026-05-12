import type { Metadata } from "next";
import "./globals.css";
import { sanityFetch } from "@/lib/sanityFetch";
import { settingsQuery } from "../../sanity/lib/queries";
import { Analytics } from "@vercel/analytics/next";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <div id="portal"></div>
        <Analytics />
      </body>
    </html>
  );
}
