import type { Metadata } from "next";
import "./globals.css";
import { sanityFetch } from "@/lib/sanityFetch";
import { settingsQuery } from "../../sanity/lib/queries";

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
        <footer className="fixed bottom-0 left-0 z-50 w-full bg-white py-0.5 text-center">
          <a
            href="/policy-licensing-disclaimer.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[9px] uppercase tracking-wide text-black/70 hover:text-acan-blue focus-visible:text-acan-blue"
          >
            Policy, Licensing & Disclaimer
          </a>
        </footer>
        <div id="portal"></div>
      </body>
    </html>
  );
}
