import type { FC, PropsWithChildren } from "react";

export const IntroText: FC<PropsWithChildren> = ({ children }) => (
  <p className="acan-text-intro col-span-5 sm:col-span-3">{children}</p>
);
