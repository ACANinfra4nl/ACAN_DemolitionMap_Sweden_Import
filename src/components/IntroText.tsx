import type { FC, PropsWithChildren } from "react";

export const IntroText: FC<PropsWithChildren> = ({ children }) => (
  <p className="text-intro col-span-5 font-bold sm:col-span-3">{children}</p>
);
