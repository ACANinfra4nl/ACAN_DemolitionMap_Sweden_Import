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
    <nav className="flex w-full items-start justify-between gap-2 p-5 text-xl font-bold uppercase leading-none">
      <Link href="/">
        Svensk
        <br />
        rivningsatlas
      </Link>
      <div className="flex flex-col">
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
      <div>
        {scaleLogo ? (
          <ScalingAcanLogo />
        ) : (
          <div className="w-14">
            <AcanLogoCircle />
          </div>
        )}
      </div>
    </nav>
  );
};
