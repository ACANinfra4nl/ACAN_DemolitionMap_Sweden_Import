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
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
