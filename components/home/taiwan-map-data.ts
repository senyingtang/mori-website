export type TaiwanCityKey =
  | "台北市"
  | "新北市"
  | "桃園市"
  | "宜蘭縣"
  | "台中市"
  | "高雄市";

export const TAIWAN_CITY_LABELS: Record<TaiwanCityKey, string> = {
  台北市: "台北市",
  新北市: "新北市",
  桃園市: "桃園市",
  宜蘭縣: "宜蘭縣",
  台中市: "台中市",
  高雄市: "高雄市",
};

/**
 * Map coordinate system
 * - viewBox: 0 0 600 760
 * - points roughly match Taiwan silhouette below
 */
export const TAIWAN_CITY_POINTS: Record<TaiwanCityKey, { x: number; y: number }> =
  {
    台北市: { x: 350, y: 148 },
    新北市: { x: 330, y: 182 },
    桃園市: { x: 292, y: 206 },
    宜蘭縣: { x: 394, y: 232 },
    台中市: { x: 278, y: 350 },
    高雄市: { x: 282, y: 572 },
  };

/**
 * City overlays (simple shapes) to avoid point-only visual.
 * These are intentionally stylized and limited to the supported cities.
 * NOTE: These are hand-authored paths; no external licensed SVG is embedded.
 */
export const TAIWAN_CITY_OVERLAYS: Record<TaiwanCityKey, string> = {
  台北市:
    "M344 132 C356 130 366 138 366 150 C366 164 354 172 342 166 C332 160 332 138 344 132 Z",
  新北市:
    "M300 148 C332 132 372 140 388 168 C402 194 382 224 350 230 C318 236 288 214 286 184 C284 166 288 156 300 148 Z",
  桃園市:
    "M258 192 C278 176 308 178 324 196 C338 212 330 238 306 244 C280 250 256 236 252 214 C250 204 252 198 258 192 Z",
  宜蘭縣:
    "M378 212 C404 202 432 218 440 244 C448 270 426 294 398 288 C372 282 360 254 364 234 C366 224 370 216 378 212 Z",
  台中市:
    "M238 320 C266 296 312 304 330 336 C348 368 324 404 286 406 C252 408 226 380 226 348 C226 334 230 326 238 320 Z",
  高雄市:
    "M236 540 C270 508 326 518 346 556 C368 598 336 648 288 648 C248 648 220 616 220 572 C220 556 226 546 236 540 Z",
};

/**
 * Taiwan silhouette path (stylized, more detailed than the old blob).
 * Hand-drawn for this project; no external license required.
 */
export const TAIWAN_SILHOUETTE_PATH =
  // Hand-authored silhouette: north narrow, east steep, west flatter, south tip.
  "M338 58 C366 82 392 120 402 160 C414 210 410 246 396 292 C384 332 388 366 378 402 C366 452 350 508 324 566 C300 632 270 692 246 676 C220 658 206 612 210 560 C214 500 232 452 236 408 C240 350 220 318 230 268 C242 212 260 156 286 112 C304 82 320 52 338 58 Z";

