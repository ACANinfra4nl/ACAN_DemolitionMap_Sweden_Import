import type { Metadata } from "next";
import "./globals.css";
import { sanityFetch } from "@/lib/sanityFetch";
import { settingsQuery } from "../../sanity/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityFetch<SettingsType>({
    query: settingsQuery,
    tags: ["settings"],
  });

  return {
    title: settings.siteTitle,
    description: settings.seo.description,
    openGraph: {
      images: [settings.seo.image.asset.url],
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
      </body>
    </html>
  );
}
