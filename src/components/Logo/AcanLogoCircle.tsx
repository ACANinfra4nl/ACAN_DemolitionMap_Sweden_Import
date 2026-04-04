import { FC } from "react";
import { AcanLogoCircleSwe } from "./AcanLogoCircleSwe";
import { AcanLogoCircleNo } from "./AcanLogoCircleNo";
import { AcanLogoCircleFin } from "./AcanLogoCircleFin";
import { AcanLogoCircleNL } from "./AcanLogoCircleNL";
import { AcanLogoCircleUK } from "./AcanLogoCircleUK";

export const AcanLogoCircle: FC<{ language: string }> = ({ language }) => {
  switch (language) {
    case "fi":
      return <AcanLogoCircleFin />;
    case "sv":
      return <AcanLogoCircleSwe />;
    case "no":
      return <AcanLogoCircleNo />;
    case "nl":
      return <AcanLogoCircleNL />;
    default:
      return <AcanLogoCircleUK />;
  }
};
