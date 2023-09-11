import { PropsWithChildren } from "react";

export const listItem = {
  bullet: ({ children }: PropsWithChildren) => (
    <li className="my-1 list-item list-disc list-inside">{children}</li>
  ),
  number: ({ children }: PropsWithChildren) => (
    <li className="my-1 list-item list-decimal list-inside">{children}</li>
  ),
};
