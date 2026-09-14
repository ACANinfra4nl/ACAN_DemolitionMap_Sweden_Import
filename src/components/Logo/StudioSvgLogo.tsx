import Link from "next/link";
import { FC } from "react";

export const StudioSvgLogo: FC<{
  src: string;
  className: string;
  openInNewTab?: boolean;
}> = ({ src, className, openInNewTab = true }) => (
  <Link
    href="https://www.architectscan.org/"
    rel="noopener noreferrer"
    target={openInNewTab ? "_blank" : undefined}
    title="Architects Climate Action Network"
    className="pointer-events-auto block"
  >
    {/* SVG from Sanity: <img> so scripts in the file cannot run. */}
    <img
      src={src}
      alt="Architects Climate Action Network"
      className={className}
    />
  </Link>
);
