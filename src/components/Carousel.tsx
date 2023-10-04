import classNames from "classnames";
import {
  FC,
  // MouseEventHandler,
  PropsWithChildren,
  UIEventHandler,
  useCallback,
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
  // const [scrollPercent, setScrollPercent] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleScroll: UIEventHandler<HTMLDivElement> = (e) => {
    const el = e.currentTarget;
    // setScrollPercent(getScrollPercent(el));
    setCurrentSlide(getCurrentSlide(el));
  };

  // const handlePrev: MouseEventHandler<HTMLButtonElement> = (e) => {
  //   if (!ref.current) return;
  //   ref.current.scrollBy({
  //     left: -ref.current.offsetWidth,
  //     behavior: "smooth",
  //   });
  //   setScrollPercent(getScrollPercent(ref.current));
  // };
  // const handleNext: MouseEventHandler<HTMLButtonElement> = (e) => {
  //   if (!ref.current) return;
  //   ref.current.scrollBy({
  //     left: ref.current.offsetWidth,
  //     behavior: "smooth",
  //   });
  //   setScrollPercent(getScrollPercent(ref.current));
  // };
  const handleGotoSlide = useCallback((n: number) => {
    if (!ref.current) return;
    const scrollPercent = n / getNumSlides(ref.current);
    ref.current.scrollTo({
      left: scrollPercent * ref.current.offsetWidth,
      behavior: "smooth",
    });
    setCurrentSlide(getCurrentSlide(ref.current));
  }, []);

  const childCount = children instanceof Array ? children.length : 1;

  return (
    <div>
      <div className="group relative">
        {/* <button
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
        </button> */}
        <div
          ref={ref}
          className="scrollbar-hide flex w-full snap-x snap-mandatory overflow-scroll"
          onScroll={handleScroll}
        >
          {children}
        </div>
        {childCount > 0 && (
          <Dots
            count={childCount}
            onClick={handleGotoSlide}
            currentSlide={currentSlide}
          />
        )}
      </div>
      {/* <div
        className="h-0.5 w-full origin-left bg-red-600"
        style={{ transform: `scaleX(${scrollPercent})` }}
      ></div> */}
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

const Dots: FC<{
  count: number;
  currentSlide: number;
  onClick: (n: number) => void;
}> = ({ count, currentSlide, onClick }) => {
  const dotsArray = new Array(count).fill(0).map((_, n) => n);
  return (
    <nav className="absolute bottom-1 left-1 right-1 flex items-center justify-center">
      {dotsArray.map((n) => (
        <button
          onClick={() => onClick(n)}
          aria-label={`Bild ${n + 1}`}
          className="p-0.5"
        >
          <span
            className={classNames(
              "block h-2 w-2 rounded-full border border-black transition-colors",
              currentSlide === n && "bg-black",
            )}
          ></span>
        </button>
      ))}
    </nav>
  );
};
