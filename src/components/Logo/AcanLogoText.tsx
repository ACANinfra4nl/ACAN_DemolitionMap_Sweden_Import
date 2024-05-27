import { FC } from "react";
import { AcanLogoTextFin } from "./AcanLogoTextFin";
import { AcanLogoTextSwe } from "./AcanLogoTextSwe";
import { AcanLogoTextNo } from "./AcanLogoTextNo";
import { AcanLogoTextUK } from "./AcanLogoTextUK";

export const AcanLogoText: FC = () => {
  switch (process.env.LANGUAGE) {
    case "fi":
      return <AcanLogoTextFin />;
    case "sv":
      return <AcanLogoTextSwe />;
    case "no":
      return <AcanLogoTextNo />;
    case "en":
      return <AcanLogoTextUK />;
  }
};
