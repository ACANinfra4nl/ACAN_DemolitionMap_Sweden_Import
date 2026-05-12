import { FC } from "react";
import Link from "next/link";
import { AcanLogoText } from "./Logo/AcanLogoText";
import { SallyLogo } from "./SallyLogo";

/** Flip to `true` when CRD branding should appear on the landing page. */
const SHOW_CRD_LOGO = false;

const CrdLogoPlaceholder: FC<{ label: string }> = ({ label }) => (  <div
    className="flex w-full items-center justify-start border border-current/25 bg-white px-4 py-6"
    role="img"
    aria-label={label}
  >
    <span className="font-condensed text-2xl uppercase leading-none tracking-wide text-current sm:text-3xl">
      CRD
    </span>
  </div>
);

/** ACAN & Sally in the manifest column; CRD gated by SHOW_CRD_LOGO. */export const LandingFooterSection: FC<{ dict: Dictionary }> = ({ dict }) => {
  const L = dict.landing;
  return (
    <div className="flex w-full flex-col gap-14">
      <AcanLogoText />
      <Link href="https://sally.doberman.co/" rel="noopener noreferrer">
        <SallyLogo />
      </Link>
      {SHOW_CRD_LOGO ? <CrdLogoPlaceholder label={L.crdLogoAlt} /> : null}    </div>
  );
};
