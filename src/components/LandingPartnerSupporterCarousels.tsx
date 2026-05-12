import type { FC, ReactNode } from "react";

const PARTNER_PLACEHOLDER_COUNT = 10;
const SUPPORTER_PLACEHOLDER_COUNT = 10;

/** Flip to `true` when the supporters carousel should appear under partners. */
const SHOW_SUPPORTERS_CAROUSEL = false;

/** Break out to viewport width while staying inside `<main>`. */const FullBleedStrip: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div
    className={`relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 ${className ?? ""}`}
  >
    {children}
  </div>
);

const LogoCarouselRow: FC<{
  heading: string;
  count: number;
  slotLabel: string;
  sectionAnnouncement: string;
}> = ({ heading, count, slotLabel, sectionAnnouncement }) => (
  <section
    className="border-t border-current/15 bg-white py-10 sm:py-12"
    aria-label={heading}
  >
    <p className="sr-only">{sectionAnnouncement}</p>
    <div className="px-5 sm:px-10 md:px-14">
      <h2 className="acan-text-menu mb-6 first-letter:uppercase sm:mb-8">
        {heading}
      </h2>
      <div className="relative">
        <div
          className="scrollbar-hide flex snap-x snap-mandatory gap-5 overflow-x-auto overflow-y-visible pb-3 pt-1 [-webkit-overflow-scrolling:touch] sm:gap-8"
          tabIndex={0}
          role="list"
          aria-label={heading}
        >
          {Array.from({ length: count }, (_, i) => {
            const n = i + 1;
            return (
              <div
                key={`${heading}-${n}`}
                role="listitem"
                className="snap-start flex-shrink-0"
              >
                <div
                  role="img"
                  aria-label={`${slotLabel} ${n}`}
                  className="flex h-[4.75rem] w-[9.25rem] items-center justify-center border border-dashed border-current/30 bg-black/[0.02] px-3 text-center text-xs font-bold uppercase leading-snug tracking-wide text-current/45 sm:h-[5.25rem] sm:w-[10.5rem]"
                >
                  {slotLabel} {n}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </section>
);

export const LandingPartnerSupporterCarousels: FC<{ dict: Dictionary }> = ({
  dict,
}) => {
  const L = dict.landing;
  return (
    <FullBleedStrip className="mt-14 pb-28 sm:pb-32">
      <LogoCarouselRow
        heading={L.partnersHeading}
        count={PARTNER_PLACEHOLDER_COUNT}
        slotLabel={L.partnerLogoPlaceholder}
        sectionAnnouncement={L.placeholderStripAnnouncement}
      />
      {SHOW_SUPPORTERS_CAROUSEL ? (
        <LogoCarouselRow
          heading={L.supportersHeading}
          count={SUPPORTER_PLACEHOLDER_COUNT}
          slotLabel={L.supporterLogoPlaceholder}
          sectionAnnouncement={L.placeholderStripAnnouncement}
        />
      ) : null}    </FullBleedStrip>
  );
};
