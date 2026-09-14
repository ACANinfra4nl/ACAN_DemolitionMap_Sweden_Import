import { FC } from "react";
import { AcanLogoTextFin } from "./AcanLogoTextFin";
import { AcanLogoTextSwe } from "./AcanLogoTextSwe";
import { AcanLogoTextNo } from "./AcanLogoTextNo";
import { AcanLogoTextNL } from "./AcanLogoTextNL";
import { AcanLogoTextUK } from "./AcanLogoTextUK";
import { StudioSvgLogo } from "./StudioSvgLogo";

export const AcanLogoText: FC<{ logoUrl?: string }> = ({ logoUrl }) => {
  if (logoUrl) {
    return (
      <StudioSvgLogo
        src={logoUrl}
        className="h-auto w-full max-w-full object-contain object-left"
        openInNewTab={false}
      />
    );
  }
  switch (process.env.LANGUAGE) {
    case "fi":
      return <AcanLogoTextFin />;
    case "sv":
      return <AcanLogoTextSwe />;
    case "no":
      return <AcanLogoTextNo />;
    case "nl":
      return <AcanLogoTextNL />;
    case "au":
    case "dk":
    case "en":
      return <AcanLogoTextUK />;
    default:
      return <AcanLogoTextUK />;
  }
};
