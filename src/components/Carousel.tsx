import classNames from "classnames";
import {
  FC,
  MouseEventHandler,
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
  return scrollWidth > offsetWidth
    ? scrollLeft / (scrollWidth - offsetWidth)
    : 0;
};
const getCurrentSlide = (el: HTMLDivElement, numSlides: number): number => {
  const currentSlide = Math.round(numSlides * getScrollPercent(el));
  return currentSlide;
};

export const Carousel: FC<PropsWithChildren> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [numSlides] = useState(children instanceof Array ? children.length : 1);

  const handleScroll: UIEventHandler<HTMLDivElement> = (e) => {
    const el = e.currentTarget;
    setCurrentSlide(getCurrentSlide(el, numSlides));
  };

  const handleGotoSlide = useCallback(
    (n: number) => {
      if (!ref.current) return;
      const scrollPercent = n / numSlides;
      ref.current.scrollTo({
        left: scrollPercent * ref.current.offsetWidth,
        behavior: "smooth",
      });
      setCurrentSlide(getCurrentSlide(ref.current, numSlides));
    },
    [numSlides],
  );
  console.log(currentSlide);
  const handlePrev: MouseEventHandler<HTMLButtonElement> = () =>
    handleGotoSlide(currentSlide - 1);
  const handleNext: MouseEventHandler<HTMLButtonElement> = () =>
    handleGotoSlide(currentSlide + 1);

  const childCount = children instanceof Array ? children.length : 1;

  return (
    <div>
      <div className="group relative">
        {childCount > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Previous"
              className="absolute bottom-0 left-0 top-0 flex items-center fill-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <span className="flex h-10 w-10 items-center justify-center bg-black">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="13"
                  viewBox="0 0 14 13"
                >
                  <path d="m6.2 12.5 1.4-1.4-4-3.9h9.6v-2H3.6l4-3.8L6.2 0 0 6.2l6.2 6.3Z" />
                </svg>
              </span>
            </button>
            <button
              onClick={handleNext}
              aria-label="Next"
              className="absolute bottom-0 right-0 top-0 flex items-center fill-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <span className="flex h-10 w-10 items-center justify-center bg-black">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="13"
                  viewBox="0 0 14 13"
                >
                  <path d="m7 12.5-1.4-1.4 4-3.9H0v-2h9.7l-4-3.8L7 0l6.2 6.2L7 12.5Z" />
                </svg>
              </span>
            </button>
          </>
        )}
        <div
          ref={ref}
          className="scrollbar-hide flex w-full snap-x snap-mandatory overflow-scroll"
          onScroll={handleScroll}
        >
          {children}
        </div>
        {/* {childCount > 1 && (
          <Dots
            count={childCount}
            onClick={handleGotoSlide}
            currentSlide={currentSlide}
          />
        )} */}
      </div>
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
    <nav className="absolute bottom-2 left-0 right-0 flex items-center justify-center">
      {dotsArray.map((n) => (
        <button
          key={n}
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
