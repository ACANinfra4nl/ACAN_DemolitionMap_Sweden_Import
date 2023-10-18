"use client";
import { FC, MouseEventHandler, ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import classNames from "classnames";
import { AcanLogoCircle } from "./AcanLogoCircle";
import { ScalingAcanLogo } from "./ScalingAcanLogo";

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
      path === href && "pointer-events-none",
    )}
    href={href}
    onClick={stopPropagation}
  >
    {children}
  </Link>
);

export const Navigation: FC<{ scaleLogo?: boolean }> = ({ scaleLogo }) => {
  const path = usePathname();
  return (
    <nav className="acan-text-menu grid w-full grid-cols-6 items-start justify-between gap-10 p-5">
      <div className="col-span-2">
        <Link
          href="/"
          className="pointer-events-auto outline-none hover:text-acan-blue focus-visible:text-acan-blue"
        >
          Rivnings&shy;kartan
        </Link>
      </div>
      <div className="col-span-2 flex flex-col">
        <div>
          <NavLink href="/karta" path={path}>
            Karta
          </NavLink>
        </div>
        <div>
          <NavLink href="/lista" path={path}>
            Lista
          </NavLink>
        </div>
        <div>
          <NavLink href="/" path={path}>
            Manifest
          </NavLink>
        </div>
        <div>
          <NavLink href="/karta?add" path={path} inverted>
            Lägg till<span className="hidden sm:inline"> byggnad</span>
          </NavLink>
        </div>
      </div>
      <div className="col-span-2">
        {scaleLogo ? (
          <ScalingAcanLogo />
        ) : (
          <div className="w-logo ml-auto">
            <AcanLogoCircle />
          </div>
        )}
      </div>
    </nav>
  );
};
