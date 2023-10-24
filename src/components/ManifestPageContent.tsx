import { PortableText } from "@portabletext/react";
import { SanityDocument } from "next-sanity";
import { FC } from "react";
import { Image } from "@/components/portableText/Image";
import { SallyLogo } from "./SallyLogo";
import { AcanLogoText } from "./AcanLogoText";
import { IntroText } from "./IntroText";
import { Navigation } from "./Navigation";
import Link from "next/link";
import { LatestSection } from "./LatestSection";

export const ManifestPageContent: FC<{
  data: SanityDocument<ManifestDocumentType>;
}> = ({ data }) => (
  <>
    <div className="absolute min-h-[1px]">
      {/* HACK: this is a hack to fix a bug with NextJS scroll restoration */}
    </div>
    <header className="pointer-events-none sticky top-0 z-10">
      <Navigation scaleLogo />
    </header>
    <main className="mt-column">
      <div className="mx-5">
        {/* <h1 className="mb-4 text-4xl font-bold">{data.heading}</h1> */}
        <div className="grid grid-cols-5 items-end gap-10">
          <div className="acan-text-intro col-span-5 sm:col-span-3">
            <PortableText value={data.intro} />
          </div>
          <div className="acan-text-intro col-start-4 sm:col-start-5">
            <Link href="/karta" className="block whitespace-nowrap">
              Karta &rarr;
            </Link>
            <Link href="/lista" className="block whitespace-nowrap">
              Lista &rarr;
            </Link>
          </div>
        </div>
      </div>
      <LatestSection buildings={data.latestBuildings} />
      <div className="mx-5 grid grid-cols-5">
        <div className="acan-text-body prose col-span-4 col-start-2 max-w-none sm:col-span-3 sm:col-start-3">
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
          <Link href="https://www.architectscan.se/" rel="noopener noreferrer">
            <AcanLogoText />
          </Link>
          <Link href="https://sally.doberman.co/" rel="noopener noreferrer">
            <SallyLogo />
          </Link>
        </div>
      </div>
    </main>
  </>
);
