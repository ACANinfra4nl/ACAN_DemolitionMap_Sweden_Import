import { FC } from "react";
import { AcanLogoCircleSwe } from "./AcanLogoCircleSwe";
import { AcanLogoCircleNo } from "./AcanLogoCircleNo";
import { AcanLogoCircleFin } from "./AcanLogoCircleFin";
import { AcanLogoCircleNL } from "./AcanLogoCircleNL";
import { AcanLogoCircleUK } from "./AcanLogoCircleUK";
import { StudioSvgLogo } from "./StudioSvgLogo";

export const AcanLogoCircle: FC<{ language: string; logoUrl?: string }> = ({
  language,
  logoUrl,
}) => {
  if (logoUrl) {
    return (
      <StudioSvgLogo
        src={logoUrl}
        className="h-auto w-full object-contain object-right"
      />
    );
  }
  switch (language) {
    case "fi":
      return <AcanLogoCircleFin />;
    case "sv":
      return <AcanLogoCircleSwe />;
    case "no":
      return <AcanLogoCircleNo />;
    case "nl":
      return <AcanLogoCircleNL />;
    case "au":
    case "dk":
    case "en":
      return <AcanLogoCircleUK />;
    default:
      return <AcanLogoCircleUK />;
  }
};
