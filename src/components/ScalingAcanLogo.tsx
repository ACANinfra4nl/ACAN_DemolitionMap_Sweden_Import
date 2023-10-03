import { FC, useEffect, useRef } from "react";
import { AcanLogoCircle } from "./AcanLogoCircle";

function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export const ScalingAcanLogo: FC = () => {
  const el = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const scrollHandler = () => {
      if (!el.current) return;
      const maxWidth = (document.body.clientWidth - 40 - 160) / 5;
      const maxScale = maxWidth / el.current.offsetWidth;
      if (window.scrollY > 0) {
        const scrollAmount = 1 - Math.min(1, window.scrollY / 500);
        el.current.style.transform = `scale(${
          1 + easeInOutCubic(scrollAmount) * (maxScale - 1)
        })`;
      } else {
        el.current.style.transform = `scale(${maxScale})`;
      }
    };
    scrollHandler();
    document.addEventListener("scroll", scrollHandler, { passive: true });
    return () => document.removeEventListener("scroll", scrollHandler);
  }, []);
  return (
    <div className="mb-36 w-14 origin-top-right" ref={el}>
      <AcanLogoCircle />
    </div>
  );
};
