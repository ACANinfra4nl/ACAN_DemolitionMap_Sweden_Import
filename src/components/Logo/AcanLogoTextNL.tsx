import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { NL_LOGO } from "./nlLogoAsset";

/** Manifest column: full-width combined mark + wordmark. */
export const AcanLogoTextNL: FC = () => (
  <Link href="https://www.architectscan.org/" rel="noopener noreferrer">
    <Image
      src={NL_LOGO.src}
      alt="Architects Climate Action Network"
      width={NL_LOGO.width}
      height={NL_LOGO.height}
      className="h-auto w-full max-w-full object-contain object-left"
      sizes="(max-width: 640px) 90vw, 400px"
    />
  </Link>
);
