import { FC, useEffect, useRef } from "react";
import { AcanLogoCircle } from "./AcanLogoCircle";

function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export const ScalingAcanLogo: FC = () => {
  const el = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const scrollHandler = (e: Event) => {
      if (!el.current) return;
      if (window.scrollY > 0) {
        const scrollAmount = 1 - Math.min(1, window.scrollY / 500);
        el.current.style.transform = `scale(${
          1 + easeInOutCubic(scrollAmount) * 3.5
        })`;
      } else {
        el.current.style.transform = "";
      }
    };
    document.addEventListener("scroll", scrollHandler, { passive: true });
    return () => document.removeEventListener("scroll", scrollHandler);
  }, []);
  return (
    <div className="w-14 origin-top-right scale-[4.5]" ref={el}>
      <AcanLogoCircle />
    </div>
  );
};
