import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { NL_LOGO } from "./nlLogoAsset";

/** Nav slot: same combined asset as text logo, scaled to the header column. */
export const AcanLogoCircleNL: FC = () => (
  <Link
    href="https://www.architectscan.org/"
    rel="noopener noreferrer"
    target="_blank"
    title="Architects Climate Action Network"
    className="pointer-events-auto block"
  >
    <Image
      src={NL_LOGO.src}
      alt="Architects Climate Action Network"
      width={NL_LOGO.width}
      height={NL_LOGO.height}
      className="h-auto w-full object-contain object-right"
      sizes="92px"
      priority
    />
  </Link>
);
