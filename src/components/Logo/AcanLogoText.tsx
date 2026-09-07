import { FC } from "react";
import { AcanLogoTextFin } from "./AcanLogoTextFin";
import { AcanLogoTextSwe } from "./AcanLogoTextSwe";
import { AcanLogoTextNo } from "./AcanLogoTextNo";
import { AcanLogoTextNL } from "./AcanLogoTextNL";
import { AcanLogoTextUK } from "./AcanLogoTextUK";

export const AcanLogoText: FC = () => {
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
