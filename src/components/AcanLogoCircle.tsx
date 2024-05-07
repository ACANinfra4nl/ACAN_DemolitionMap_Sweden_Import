import Link from "next/link";
import { FC } from "react";
import { AcanLogoCircleSwe } from "./AcanLogoCircleSwe";
import { AcanLogoCircleNo } from "./AcanLogoCircleNo";
import { AcanLogoCircleFin } from "./AcanLogoCircleFin";

export const AcanLogoCircle: FC<{ language: string }> = ({ language }) => {
  if (language === "fi") {
    return <AcanLogoCircleFin />;
  } else if (language === "sv") {
    return <AcanLogoCircleSwe />;
  } else {
    return <AcanLogoCircleNo />;
  }
};
