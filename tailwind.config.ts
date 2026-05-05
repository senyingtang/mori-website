import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: "#6D28D9",
          "deep-purple": "#1E103D",
          "neon-purple": "#A855F7",
          blue: "#2563EB",
          cyan: "#38BDF8",
          red: "#EF4444",
          "hot-red": "#F43F5E",
        },
      },
    },
  },
  plugins: [],
};

export default config;
