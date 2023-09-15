"use client";
import { FC, ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import classNames from "classnames";

const NavLink: FC<{ href: string; path: string; children: ReactNode }> = ({
  href,
  path,
  children,
}) => (
  <Link
    className={classNames("p-3", path === href && "pointer-events-none")}
    href={href}
  >
    {children}
  </Link>
);

export const Navigation: FC<{ color: string }> = ({ color }) => {
  const path = usePathname();
  return (
    <div
      className={classNames(
        "flex justify-between p-4 w-full border-b border-current border-solid",
        color
      )}
    >
      <nav className="flex items-center gap-5">
        <span className="uppercase">
          Svensk
          <br />
          rivningsatlas
        </span>
        <NavLink href="/" path={path}>
          Karta
        </NavLink>
        <NavLink href="/lista" path={path}>
          Lista
        </NavLink>
        <NavLink href="/manifest" path={path}>
          Manifest
        </NavLink>
      </nav>
    </div>
  );
};
