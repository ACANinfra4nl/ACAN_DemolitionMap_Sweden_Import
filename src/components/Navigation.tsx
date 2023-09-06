"use client";
import { FC } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import classNames from "classnames";

export const Navigation: FC = () => {
  const path = usePathname();
  return (
    <nav className="flex">
      <Link
        className={classNames(
          "p-4",
          !path.includes("/map") && !path.includes("/list") && "underline"
        )}
        href="/"
      >
        Home
      </Link>
      <Link
        className={classNames("p-4", path.includes("/map") && "underline")}
        href="/map"
      >
        Map
      </Link>
      <Link
        className={classNames("p-4", path.includes("/list") && "underline")}
        href="/list"
      >
        List
      </Link>
    </nav>
  );
};
