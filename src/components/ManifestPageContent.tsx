import { PortableText } from "@portabletext/react";
import { SanityDocument } from "next-sanity";
import { FC } from "react";
import { Image } from "@/components/portableText/Image";
import { SallyLogo } from "./SallyLogo";
import { AcanLogoText } from "./Logo/AcanLogoText";
import { IntroText } from "./IntroText";
import { Navigation } from "./Navigation";
import Link from "next/link";

export const ManifestPageContent: FC<{
  data: SanityDocument<ManifestDocumentType> | null;
  dict: Dictionary;
}> = ({ data, dict }) => {
  if (!data) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Manifest Not Found</h1>
        <p>The manifest document could not be loaded.</p>
      </div>
    );
  }

  return (
    <>
      <div className="absolute min-h-[1px]">
        {/* HACK: this is a hack to fix a bug with NextJS scroll restoration */}
      </div>
      <header className="pointer-events-none sticky top-0 z-10">
        <Navigation scaleLogo dict={dict} />
      </header>
      <main className="mt-column">
        <div className="mx-5">
          <div className="grid grid-cols-6 items-end gap-10">
            <div className="acan-text-intro col-span-6 sm:col-span-4">
              <PortableText value={data.intro} />
            </div>
            <div className="acan-text-intro col-span-2 col-start-5 flex justify-end sm:col-span-1 sm:col-start-6 sm:justify-start">
              <div>
                <Link
                  href={`/${dict.slugs.map}`}
                  className="block whitespace-nowrap"
                >
                  {dict.nav.map} &rarr;
                </Link>
                <Link
                  href={`/${dict.slugs.list}`}
                  className="block whitespace-nowrap"
                >
                  {dict.nav.list} &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-5 mt-column grid grid-cols-6 gap-x-10">
          <div className="acan-text-body prose col-span-6 max-w-none sm:col-span-3 sm:col-start-3">
            <PortableText
              value={data.content}
              components={{
                types: { image: Image },
                block: {
                  intro: IntroText,
                },
              }}
            />
          </div>
          <div className="w-column col-span-3 col-start-2 mb-32 mt-16 flex flex-col gap-14 sm:col-span-1 sm:col-start-3">
            <AcanLogoText />

            <Link href="https://sally.doberman.co/" rel="noopener noreferrer">
              <SallyLogo />
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};
