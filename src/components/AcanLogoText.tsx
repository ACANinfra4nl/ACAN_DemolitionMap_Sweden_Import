import { FC } from "react";
import { AcanLogoTextFin } from "./AcanLogoTextFin";
import { AcanLogoTextSwe } from "./AcanLogoTextSwe";
import { AcanLogoTextNo } from "./AcanLogoTextNo";

export const AcanLogoText: FC = () => {
  if (process.env.LANGUAGE === "fi") {
    return <AcanLogoTextFin />;
  } else if (process.env.LANGUAGE === "sv") {
    return <AcanLogoTextSwe />;
  } else {
    return <AcanLogoTextNo />;
  }
};
