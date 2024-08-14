import classNames from "clsx";
import { ButtonHTMLAttributes, FC, PropsWithChildren } from "react";

export const Button: FC<
  PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>
> = ({ className, children, ...props }) => (
  <button
    className={classNames(
      "border-r-2 border-none bg-black px-5 py-4 font-condensed uppercase leading-none text-white outline-none focus-within:bg-acan-blue hover:bg-acan-blue disabled:bg-disabled disabled:text-white",
      className,
    )}
    {...props}
  >
    {children}
  </button>
);
