"use client";
import { FC, MouseEventHandler, ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import classNames from "clsx";
import { AcanLogoCircle } from "./Logo/AcanLogoCircle";
import { ScalingAcanLogo } from "./Logo/ScalingAcanLogo";
import {
  COUNTRY_DEPLOYMENTS,
  getHomeCountryCode,
} from "@/lib/countrySanity";

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
  const mapHref = `/${dict.slugs.map}`;
  const listHref = `/${dict.slugs.list}`;
  const titleHref = path === "/" ? mapHref : "/";
  const homeCountry = getHomeCountryCode();
  const logoLanguage = homeCountry ?? dict.nav.language;
  const showEnglishToggle = Boolean(
    homeCountry && COUNTRY_DEPLOYMENTS[homeCountry].features.englishToggle,
  );
  const uiIsEnglish = dict.nav.language === "en";

  return (
    <nav className="acan-text-menu grid w-full grid-cols-6 items-start justify-between gap-10 p-5">
      <div className="col-span-2">
        <Link
          href={titleHref}
          className="pointer-events-auto outline-none hover:text-acan-blue focus-visible:text-acan-blue"
          dangerouslySetInnerHTML={{ __html: dict.nav.title }}
        ></Link>
      </div>
      <div className="col-span-2 flex flex-col">
        <div>
          <NavLink href={mapHref} path={path}>
            {dict.nav.map}
          </NavLink>
        </div>
        <div>
          <NavLink href={listHref} path={path}>
            {dict.nav.list}
          </NavLink>
        </div>
        <div>
          <NavLink href="/" path={path}>
            {dict.nav.about}
          </NavLink>
        </div>
        <div>
          <NavLink href={`${mapHref}?add`} path={path} inverted>
            {dict.nav.addOne}
            <span className="hidden sm:inline"> {dict.nav.addTwo}</span>
          </NavLink>
        </div>
        {showEnglishToggle ? (
          <div className="mt-2 flex gap-2 text-sm">
            <a
              href="/api/ui-lang?lang=home"
              className={classNames(
                "pointer-events-auto outline-none hover:text-acan-blue",
                !uiIsEnglish && "text-acan-blue",
              )}
            >
              {dict.nav.langLocal}
            </a>
            <span aria-hidden="true">/</span>
            <a
              href="/api/ui-lang?lang=en"
              className={classNames(
                "pointer-events-auto outline-none hover:text-acan-blue",
                uiIsEnglish && "text-acan-blue",
              )}
            >
              {dict.nav.langEn}
            </a>
          </div>
        ) : null}
      </div>
      <div className="col-span-2">
        {scaleLogo ? (
          <ScalingAcanLogo language={logoLanguage} />
        ) : (
          <div className="ml-auto w-logo">
            <AcanLogoCircle language={logoLanguage} />
          </div>
        )}
      </div>
    </nav>
  );
};
