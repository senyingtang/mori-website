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
           * 023 視覺：奶茶色明亮版（前台）
           * 為降低改動風險，保留既有 `brand.*` key（元件 className 仍可沿用），
           * 但色票已改為奶茶系；請勿再以「紫/紅/藍」語意理解。
           */
          purple: "#B98552", // 咖金（主 CTA / 強調）
          "deep-purple": "#5A3E2B", // 深咖（主文字/深色底）
          "neon-purple": "#FFF8ED", // 奶油白（高亮底色/卡片）
          blue: "#6FA37B", // 球場綠（少量點綴）
          cyan: "#DDEBDD", // 淡綠（輔助背景）
          red: "#3A2A1E", // 主文字深咖
          "hot-red": "#D6A86C", // 奶茶金（hover/光暈）
        },
      },
    },
  },
  plugins: [],
};

export default config;
