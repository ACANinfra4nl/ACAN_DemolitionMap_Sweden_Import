import Link from "next/link";
import { FC } from "react";

export const AcanLogoCircleUK: FC = () => (
  <Link
    href="https://www.architectscan.org/"
    rel="noopener noreferrer"
    target="_blank"
    title="Architects Climate Action Network"
    className="pointer-events-auto block fill-acan-blue hover:fill-black"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="480"
      height="480"
      viewBox="0 0 480 480"
      className="h-auto w-full"
    >
      <path d="M186.5 259h34.6l-17.2-91.3-17.4 91.3z" />
      <path d="M240 0a240 240 0 1 0 0 480 240 240 0 0 0 0-480Zm95.9 128.2-5 148.8h-34.6l-4.9-148.8H336Zm-99.1 215-9.2-48.8H180l-9.3 48.7h-38l44.2-211.6h54l44.3 211.6h-38.4Zm76.8.4a23.6 23.6 0 1 1 0-47.2 23.6 23.6 0 0 1 0 47.2Z" />
    </svg>
  </Link>
);
