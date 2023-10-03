"use client";
import { FC, ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import classNames from "classnames";
import { AcanLogoCircle } from "./AcanLogoCircle";
import { ScalingAcanLogo } from "./ScalingAcanLogo";

const NavLink: FC<{ href: string; path: string; children: ReactNode }> = ({
  href,
  path,
  children,
}) => (
  <Link
    className={classNames(path === href && "pointer-events-none")}
    href={href}
  >
    {children}
  </Link>
);

export const Navigation: FC<{ scaleLogo?: boolean }> = ({ scaleLogo }) => {
  const path = usePathname();
  return (
    <nav className="text-menu-s sm:text-menu grid w-full grid-cols-5 items-start justify-between gap-10 p-5 uppercase">
      <Link href="/" className="col-span-2">
        Svensk
        <br />
        rivningsatlas
      </Link>
      <div className="col-span-2 col-start-3 flex flex-col">
        <NavLink href="/" path={path}>
          Karta
        </NavLink>
        <NavLink href="/lista" path={path}>
          Lista
        </NavLink>
        <NavLink href="/manifest" path={path}>
          Manifest
        </NavLink>
      </div>
      <div className="col-start-5 sm:col-start-5">
        {scaleLogo ? (
          <ScalingAcanLogo />
        ) : (
          <div className="ml-auto w-14">
            <AcanLogoCircle />
          </div>
        )}
      </div>
    </nav>
  );
};
