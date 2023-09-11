"use client";
import { FC } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import classNames from "classnames";

export const Navigation: FC = () => {
  const path = usePathname();
  return (
    <nav className="flex">
      <Link className={classNames("p-4", path === "/" && "underline")} href="/">
        Hem
      </Link>
      <Link
        className={classNames("p-4", path.includes("/karta") && "underline")}
        href="/karta"
      >
        Karta
      </Link>
      <Link
        className={classNames("p-4", path.includes("/lista") && "underline")}
        href="/lista"
      >
        Lista
      </Link>
      <Link
        className={classNames("p-4", path.includes("/manifest") && "underline")}
        href="/manifest"
      >
        Manifest
      </Link>
    </nav>
  );
};
