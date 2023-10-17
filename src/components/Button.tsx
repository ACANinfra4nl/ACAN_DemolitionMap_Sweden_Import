import classNames from "classnames";
import { ButtonHTMLAttributes, FC, PropsWithChildren } from "react";

export const Button: FC<
  PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>
> = ({ className, children, ...props }) => (
  <button
    className={classNames(
      "font-condensed border-r-2 border-none bg-black px-5 py-4 uppercase leading-none text-white outline-none focus-within:bg-acan-blue hover:bg-acan-blue",
      className,
    )}
    {...props}
  >
    {children}
  </button>
);
