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
    <footer className="fixed bottom-0 left-0 z-50 w-full bg-white py-0.5 text-center">
      <a
        href="/policy-licensing-disclaimer.html"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[9px] uppercase tracking-wide text-black/70 hover:text-acan-blue focus-visible:text-acan-blue"
      >
        Policy, Licensing & Disclaimer
      </a>
    </footer>
  );
};
