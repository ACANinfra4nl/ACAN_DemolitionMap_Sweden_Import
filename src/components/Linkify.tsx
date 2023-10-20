import { FC, Fragment, PropsWithChildren } from "react";
import LinkifyReact from "linkify-react";

export const Linkify: FC<PropsWithChildren> = ({ children }) => (
  <LinkifyReact
    as={Fragment}
    options={{
      attributes: { rel: "noreferrer noopener", target: "_blank" },
    }}
  >
    {children}
  </LinkifyReact>
);
