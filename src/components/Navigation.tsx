"use client";
import { FC, MouseEventHandler, PropsWithChildren, ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import classNames from "clsx";
import { AcanLogoCircle } from "./Logo/AcanLogoCircle";
import { ScalingAcanLogo } from "./Logo/ScalingAcanLogo";

const stopPropagation: MouseEventHandler<HTMLAnchorElement> = (e) => {
  e.nativeEvent.stopImmediatePropagation();
};

const NavLink: FC<{
  href: string;
  path: string;
  children: ReactNode;
  inverted?: boolean;
}> = ({ href, path, children, inverted }) => (
  <Link
    className={classNames(
      "pointer-events-auto outline-none",
      inverted
        ? "bg-black px-1 text-white hover:bg-acan-blue hover:text-white focus-visible:bg-acan-blue focus-visible:text-white"
        : "hover:text-acan-blue focus-visible:text-acan-blue",
      path === href && "pointer-events-none text-acan-blue",
    )}
    href={href}
    onClick={stopPropagation}
  >
    {children}
  </Link>
);

export const Navigation: FC<{ scaleLogo?: boolean; dict: Dictionary }> = ({
  scaleLogo,
  dict,
}) => {
  const path = usePathname();

  return (
    <nav className="acan-text-menu grid w-full grid-cols-6 items-start justify-between gap-10 p-5">
      <div className="col-span-2">
        <Link
          href={`/${dict.nav.map}`}
          className="pointer-events-auto outline-none hover:text-acan-blue focus-visible:text-acan-blue"
          dangerouslySetInnerHTML={{ __html: dict.nav.title }}
        ></Link>
      </div>
      <div className="col-span-2 flex flex-col">
        <div>
          <NavLink href={`/${dict.nav.map}`} path={path}>
            {dict.nav.map}
          </NavLink>
        </div>
        <div>
          <NavLink href={`/${dict.nav.list}`} path={path}>
            {dict.nav.list}
          </NavLink>
        </div>
        <div>
          <NavLink href="/" path={path}>
            {dict.nav.about}
          </NavLink>
        </div>
        <div>
          <NavLink href={`/${dict.nav.map}?add`} path={path} inverted>
            {dict.nav.addOne}
            <span className="hidden sm:inline"> {dict.nav.addTwo}</span>
          </NavLink>
        </div>
      </div>
      <div className="col-span-2">
        {scaleLogo ? (
          <ScalingAcanLogo language={dict.nav.language} />
        ) : (
          <div className="ml-auto w-logo">
            <AcanLogoCircle language={dict.nav.language} />
          </div>
        )}
      </div>
    </nav>
  );
};
