import classNames from "clsx";
import {
  FC,
  MouseEventHandler,
  PropsWithChildren,
  useCallback,
  useRef,
  useState,
} from "react";

export const Carousel: FC<
  PropsWithChildren<Pick<Dictionary, "ariaLabels">>
> = ({ children, ariaLabels }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [numSlides] = useState(children instanceof Array ? children.length : 1);

  const handleGotoSlide = useCallback(
    (n: number) => {
      if (!ref.current) return;
      const scrollAmount = (n * ref.current.scrollWidth) / numSlides;
      ref.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    },
    [numSlides],
  );

  const handlePrev: MouseEventHandler<HTMLButtonElement> = () =>
    handleGotoSlide(-1);
  const handleNext: MouseEventHandler<HTMLButtonElement> = () =>
    handleGotoSlide(1);

  const childCount = children instanceof Array ? children.length : 1;

  return (
    <div>
      <div className="group relative">
        {childCount > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label={ariaLabels.previous}
              className="absolute bottom-0 left-0 top-0 flex items-center fill-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <span className="flex h-10 w-10 items-center justify-center bg-black hover:bg-acan-blue">
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
              aria-label={ariaLabels.next}
              className="absolute bottom-0 right-0 top-0 flex items-center fill-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <span className="flex h-10 w-10 items-center justify-center bg-black hover:bg-acan-blue">
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
        >
          {children}
        </div>
      </div>
    </div>
  );
};

const Dots: FC<
  Pick<Dictionary, "ariaLabels"> & {
    count: number;
    currentSlide: number;
    onClick: (n: number) => void;
  }
> = ({ count, currentSlide, onClick, ariaLabels }) => {
  const dotsArray = new Array(count).fill(0).map((_, n) => n);
  return (
    <nav className="absolute bottom-2 left-0 right-0 flex items-center justify-center">
      {dotsArray.map((n) => (
        <button
          key={n}
          onClick={() => onClick(n)}
          aria-label={`${ariaLabels.image} ${n + 1}`}
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
