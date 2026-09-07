"use client";

import { FC, useRef, useState } from "react";
import {
  COUNTRY_SANITY_LOCALES,
  type CountrySanityLocale,
} from "@/lib/countrySanity";
import { useClickOutside } from "@/app/hooks/useClickOutside";

export const LayerSettings: FC<{
  homeCountry: CountrySanityLocale;
  enabledCountries: CountrySanityLocale[];
  onToggle: (country: CountrySanityLocale) => void;
  dict: Dictionary;
}> = ({ homeCountry, enabledCountries, onToggle, dict }) => {
  const [open, setOpen] = useState(false);
  const panelEl = useRef<HTMLDivElement>(null);
  useClickOutside(panelEl, () => setOpen(false));
  const others = COUNTRY_SANITY_LOCALES.filter(
    (country) => country !== homeCountry,
  );
  const activeCount = enabledCountries.length;

  return (
    <div className="absolute right-5 top-5 z-10" ref={panelEl}>
      <button
        type="button"
        className="border-none bg-black px-4 py-3 font-condensed uppercase leading-none text-white outline-none hover:bg-acan-blue focus-visible:bg-acan-blue"
        aria-expanded={open}
        aria-controls="layer-settings-panel"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((value) => !value);
        }}
      >
        {dict.layers.button}
        {activeCount > 0 ? ` (${activeCount})` : ""}
      </button>
      {open && (
        <div
          id="layer-settings-panel"
          className="absolute right-0 mt-2 w-64 bg-white p-4 text-black shadow-none ring-1 ring-black/10"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="font-condensed text-sm uppercase">{dict.layers.heading}</p>
          <p className="mt-2 text-xs text-black/60">
            {dict.layers.thisCountryHint}
          </p>
          <label className="mt-3 flex items-center gap-2 text-sm opacity-60">
            <input type="checkbox" checked disabled />
            {dict.layers.countries[homeCountry]}
          </label>
          <div className="mt-3 flex flex-col gap-2">
            {others.map((country) => (
              <label key={country} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={enabledCountries.includes(country)}
                  onChange={() => onToggle(country)}
                />
                {dict.layers.countries[country]}
              </label>
            ))}
          </div>
          <p className="mt-3 text-xs text-black/55">{dict.layers.openInCountry}</p>
        </div>
      )}
    </div>
  );
};
