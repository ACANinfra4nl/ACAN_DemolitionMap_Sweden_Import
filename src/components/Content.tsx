import { PortableText } from "@portabletext/react";
import { SanityDocument } from "next-sanity";
import { FC } from "react";
import { Image } from "@/components/portableText/Image";
import { SallyLogo } from "./SallyLogo";
import { AcanLogoText } from "./AcanLogoText";
import { LatestSection } from "./LatestSection";
import { IntroText } from "./IntroText";
import { fixBuildingImages } from "@/lib/buildingToFeature";
import { Navigation } from "./Navigation";
import Link from "next/link";

export const Content: FC<{ data: SanityDocument<ManifestDocumentType> }> = ({
  data,
}) => (
  <>
    <div className="sticky top-0">
      <Navigation scaleLogo />
    </div>
    <main>
      <div className="mx-5">
        {/* <h1 className="mb-4 text-4xl font-bold">{data.heading}</h1> */}
        <div className="grid grid-cols-5 items-end gap-10">
          <IntroText>{data.intro}</IntroText>
          <div className="col-start-5 text-xl font-bold">
            <Link href="/karta" className="block">
              <span className="underline">Karta</span> &rarr;
            </Link>
            <Link href="/lista" className="block">
              <span className="underline">Lista</span> &rarr;
            </Link>
          </div>
        </div>
      </div>
      <LatestSection buildings={data.latestBuildings.map(fixBuildingImages)} />
      <div className="prose mx-5">
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
      <div className="mx-auto my-16 flex w-64 flex-col gap-14 px-5">
        <AcanLogoText />
        <SallyLogo />
      </div>
    </main>
  </>
);
