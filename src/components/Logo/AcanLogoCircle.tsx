import { FC } from "react";
import { AcanLogoCircleSwe } from "./AcanLogoCircleSwe";
import { AcanLogoCircleNo } from "./AcanLogoCircleNo";
import { AcanLogoCircleFin } from "./AcanLogoCircleFin";
import { AcanLogoCircleUK } from "./AcanLogoCircleUK";

export const AcanLogoCircle: FC<{ language: string }> = ({ language }) => {
  switch (language) {
    case "fi":
      return <AcanLogoCircleFin />;
    case "sv":
      return <AcanLogoCircleSwe />;
    case "no":
      return <AcanLogoCircleNo />;
    default:
      return <AcanLogoCircleUK />;
  }
};
