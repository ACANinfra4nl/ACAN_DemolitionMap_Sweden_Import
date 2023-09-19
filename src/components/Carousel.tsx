import {
  FC,
  MouseEventHandler,
  PropsWithChildren,
  UIEventHandler,
  useRef,
  useState,
} from "react";

const getScrollPercent = (el: HTMLDivElement) => {
  const scrollLeft = el.scrollLeft;
  const scrollWidth = el.scrollWidth;
  const offsetWidth = el.offsetWidth;
  return scrollLeft / (scrollWidth - offsetWidth);
};
const getNumSlides = (el: HTMLDivElement) => {
  const scrollWidth = el.scrollWidth;
  const offsetWidth = el.offsetWidth;
  return Math.round((scrollWidth - offsetWidth) / offsetWidth);
};
const getCurrentSlide = (el: HTMLDivElement) => {
  const numSlides = getNumSlides(el);
  const currentSlide = Math.round(numSlides * getScrollPercent(el));
  return currentSlide;
};

export const Carousel: FC<PropsWithChildren> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [scrollPercent, setScrollPercent] = useState(0);

  const handleScroll: UIEventHandler<HTMLDivElement> = (e) => {
    const el = e.currentTarget;
    setScrollPercent(getScrollPercent(el));
  };

  const handlePrev: MouseEventHandler<HTMLButtonElement> = (e) => {
    if (!ref.current) return;
    ref.current.scrollBy({
      left: -ref.current.offsetWidth,
      behavior: "smooth",
    });
    setScrollPercent(getScrollPercent(ref.current));
  };
  const handleNext: MouseEventHandler<HTMLButtonElement> = (e) => {
    if (!ref.current) return;
    ref.current.scrollBy({
      left: ref.current.offsetWidth,
      behavior: "smooth",
    });
    setScrollPercent(getScrollPercent(ref.current));
  };
  return (
    <div>
      <div className="relative group">
        <button
          onClick={handlePrev}
          aria-label="Previous"
          className="absolute left-0 top-0 bottom-0 p-2 bg-white/50 transition-opacity opacity-0 group-hover:opacity-100"
        >
          &lsaquo;
        </button>
        <button
          onClick={handleNext}
          aria-label="Next"
          className="absolute right-0 top-0 bottom-0 p-2 bg-white/50 transition-opacity opacity-0 group-hover:opacity-100"
        >
          &rsaquo;
        </button>
        <div
          ref={ref}
          className="w-full flex overflow-scroll snap-x snap-mandatory scrollbar-hide"
          onScroll={handleScroll}
        >
          {children}
        </div>
      </div>
      <div
        className="h-0.5 bg-red-600 w-full origin-left"
        style={{ transform: `scaleX(${scrollPercent})` }}
      ></div>
      {/* <div>
        {ref.current && (
          <>
            {getCurrentSlide(ref.current) + 1}/{getNumSlides(ref.current) + 1}
          </>
        )}
      </div> */}
    </div>
  );
};
