"use client";

import { useEffect, useState } from "react";

export const PolicyFooter = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const inIframe = window.self !== window.top;
    const fromStudio = document.referrer.includes("/studio");
    if (inIframe && fromStudio) {
      setIsVisible(false);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <footer className="fixed bottom-0 left-0 z-50 w-full bg-white py-0.5 text-center text-[9px] text-black/60">
      <span className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
        <a
          href="/policy-licensing-disclaimer.html"
          target="_blank"
          rel="noopener noreferrer"
          className="uppercase tracking-wide text-black/70 hover:text-acan-blue focus-visible:text-acan-blue"
        >
          Policy, Licensing & Disclaimer
        </a>
        <span aria-hidden className="text-black/35">
          ·
        </span>
        <a
          href="mailto:info@sloopkaart.nl"
          className="text-black/70 hover:text-acan-blue focus-visible:text-acan-blue"
        >
          info@sloopkaart.nl
        </a>
      </span>
    </footer>
  );
};
