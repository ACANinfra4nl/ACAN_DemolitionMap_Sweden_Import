import { PropsWithChildren } from "react";

export const list = {
  bullet: ({ children }: PropsWithChildren) => (
    <ul className="my-4">{children}</ul>
  ),
  number: ({ children }: PropsWithChildren) => (
    <ol className="my-4">{children}</ol>
  ),
};
