import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        demolished: "#F00",
        threatened: "#FFB800",
        saved: "#41B82E",
        "acan-blue": "#2637f3",
        disabled: "#9E9E9E",
        gray: {
          list: "#292929",
          unknown: "#e9e9e9",
        },
      },
      fontSize: {
        intro: [
          "clamp(1.25rem,3vw,3rem)",
          { fontWeight: "600", lineHeight: "1.05" },
        ],
        menu: ["1.375rem", { fontWeight: "600", lineHeight: "1.05" }],
        "menu-s": ["1.125rem", { fontWeight: "600", lineHeight: "1.05" }],
        body: [
          "1rem",
          {
            fontWeight: "700",
            lineHeight: "1.05",
          },
        ],
        list: ["0.875rem", { fontWeight: 700, lineHeight: "1.05" }],
      },
      margin: {
        column: "calc(20% - 2.5rem)",
      },
      spacing: {
        "header-s": "7.25rem",
        header: "8.25rem",
      },
      fontFamily: {
        sans: ["Arial", "sans-serif"],
        condensed: [
          "SpeziaCondensed",
          "Spezia",
          '"Helvetica Neue"',
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      screens: {
        xs: "420px",
        xl: "1600px",
      },
      width: {
        logo: "5.75rem",
      },
      aspectRatio: {
        wide: "2/1",
      },
      typography: {
        DEFAULT: {
          css: {
            "--tw-prose-body": "inherit",
            "--tw-prose-headings": "inherit",
            "--tw-prose-lead": "inherit",
            "--tw-prose-links": "inherit",
            "--tw-prose-bold": "inherit",
            "--tw-prose-counters": "inherit",
            "--tw-prose-bullets": "inherit",
            "--tw-prose-hr": "inherit",
            "--tw-prose-quotes": "inherit",
            "--tw-prose-quote-borders": "inherit",
            "--tw-prose-captions": "inherit",
            "--tw-prose-kbd": "inherit",
            "--tw-prose-kbd-shadows": "inherit",
            "--tw-prose-code": "inherit",
            "--tw-prose-pre-code": "inherit",
            "--tw-prose-pre-bg": "inherit",
            "--tw-prose-th-borders": "inherit",
            "--tw-prose-td-borders": "inherit",
            a: {
              fontWeight: "inherit",
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
