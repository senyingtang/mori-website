import type { TaiwanCityKey } from "@/components/home/taiwan-map-data";

export const TAIWAN_CITY_FOCUS: Record<
  TaiwanCityKey,
  { scale: number; x: number; y: number }
> = {
  // Keep focus natural: don't throw the opposite end completely out of frame.
  台北市: { scale: 1.78, x: -92, y: 52 },
  新北市: { scale: 1.72, x: -78, y: 40 },
  桃園市: { scale: 1.62, x: -52, y: 26 },
  宜蘭縣: { scale: 1.62, x: -122, y: 18 },
  台中市: { scale: 1.52, x: -46, y: -62 },
  高雄市: { scale: 1.45, x: -42, y: -158 },
};

