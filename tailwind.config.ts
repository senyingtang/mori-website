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
          /**
           * 020 視覺：深咖黑 / 球團金 / 奶油白 / 少量球場綠
           * 為降低改動風險，保留既有 `brand.*` key（元件 className 仍可沿用），
           * 但色票已全面改為新主視覺；請勿再以「紫/紅/藍」語意理解。
           */
          purple: "#CDA274", // 球團金（主 CTA / 強調）
          "deep-purple": "#140F0D", // 深咖黑（背景基底）
          "neon-purple": "#F6F1E8", // 奶油白（高亮文字/描邊）
          blue: "#2F6B4F", // 球場綠（少量點綴）
          cyan: "#8FB9A3", // 淡球場綠（輔助）
          red: "#3A2721", // 深咖（陰影/次強調）
          "hot-red": "#E1C08B", // 淡金（hover/光暈）
        },
      },
    },
  },
  plugins: [],
};

export default config;
