import Link from "next/link";
import { FC } from "react";
import { AcanLogoCircleSwe } from "./AcanLogoCircleSwe";
import { AcanLogoCircleNo } from "./AcanLogoCircleNo";
import { AcanLogoCircleFin } from "./AcanLogoCircleFin";

export const AcanLogoCircle: FC = () => {
  if (process.env.LANGUAGE === "fi") {
    return <AcanLogoCircleFin />;
  } else if (process.env.LANGUAGE === "sv") {
    return <AcanLogoCircleSwe />;
  } else {
    return <AcanLogoCircleNo />;
  }
};
