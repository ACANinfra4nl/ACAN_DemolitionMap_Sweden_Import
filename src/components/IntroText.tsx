import type { FC, PropsWithChildren } from "react";

export const IntroText: FC<PropsWithChildren> = ({ children }) => (
  <p className="col-span-3 text-xl font-bold">{children}</p>
);
