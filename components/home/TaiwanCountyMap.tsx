"use client";

import type { MapTabType } from "@/types/cms";
import type { TaiwanCityKey } from "@/components/home/taiwan-map-data";
import {
  TAIWAN_CITY_LABELS,
  TAIWAN_CITY_OVERLAYS,
  TAIWAN_CITY_POINTS,
  TAIWAN_SILHOUETTE_PATH,
} from "@/components/home/taiwan-map-data";
import { TAIWAN_CITY_FOCUS } from "@/components/home/taiwan-map-focus";

type Props = {
  activeTab: MapTabType;
  activeCity: TaiwanCityKey | null;
  hoverCity: TaiwanCityKey | null;
  cities: TaiwanCityKey[];
  onHoverCity: (city: TaiwanCityKey) => void;
  onLeaveCity: () => void;
  onSelectCity: (city: TaiwanCityKey) => void;
};

function colors(activeTab: MapTabType) {
  if (activeTab === "dropin") {
    return {
      glow: "#8bbf9f",
      soft: "rgba(139,191,159,0.30)",
      soft2: "rgba(139,191,159,0.16)",
    };
  }
  return {
    glow: "#cda274",
    soft: "rgba(205,162,116,0.32)",
    soft2: "rgba(205,162,116,0.16)",
  };
}

function isActiveCity(city: TaiwanCityKey, activeCity: TaiwanCityKey | null) {
  return activeCity === city;
}

export function TaiwanCountyMap({
  activeTab,
  activeCity,
  hoverCity,
  cities,
  onHoverCity,
  onLeaveCity,
  onSelectCity,
}: Props) {
  const c = colors(activeTab);
  const focus = activeCity ? TAIWAN_CITY_FOCUS[activeCity] : null;
  const displayCity = hoverCity ?? activeCity;

  const transform = focus
    ? `translate(${focus.x} ${focus.y}) scale(${focus.scale})`
    : "translate(0 0) scale(1)";

  return (
    <div className="relative w-full overflow-hidden">
      {/* Background scan / rings */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(255,255,255,0.08)] opacity-60 blur-[0.2px] orbit-scan md:h-[620px] md:w-[620px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[58%] h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${c.soft2}, transparent 55%)`,
        }}
      />

      <svg
        viewBox="0 0 600 760"
        className="relative block h-[390px] w-full max-w-full select-none sm:h-[430px] md:h-[540px] lg:h-[620px] map-float"
        role="img"
        aria-label="台灣互動地圖"
        onClick={(e) => {
          // click background to clear hover (optional)
          if (e.currentTarget === e.target) onLeaveCity();
        }}
      >
        <defs>
          <linearGradient id="twOutlineFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.06)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.30)" />
          </linearGradient>
          <filter id="cityGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Focus/zoom group */}
        <g
          style={{
            transformOrigin: "300px 380px",
            transition: "transform 750ms cubic-bezier(0.2, 0.8, 0.2, 1)",
            transform,
          }}
        >
          {/* Taiwan silhouette */}
          <path
            d={TAIWAN_SILHOUETTE_PATH}
            fill="url(#twOutlineFill)"
            stroke="rgba(255,255,255,0.14)"
            strokeWidth="2"
          />

          {/* City overlays */}
          {cities.map((city) => {
            const isActive = isActiveCity(city, activeCity);
            const isHover = hoverCity === city;
            const isDim = Boolean(displayCity) && displayCity !== city;
            const overlay = TAIWAN_CITY_OVERLAYS[city];
            const p = TAIWAN_CITY_POINTS[city];

            return (
              <g
                key={city}
                onMouseEnter={() => onHoverCity(city)}
                onMouseLeave={() => onLeaveCity()}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectCity(city);
                }}
                style={{ cursor: "pointer" }}
                opacity={isDim ? 0.42 : 1}
              >
                {/* soft halo */}
                {(isActive || isHover) && (
                  <path
                    d={overlay}
                    fill={c.soft}
                    opacity={0.85}
                    filter="url(#cityGlow)"
                  />
                )}
                {/* solid overlay */}
                <path
                  d={overlay}
                  fill={isActive || isHover ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.06)"}
                  stroke={isActive || isHover ? c.glow : "rgba(255,255,255,0.10)"}
                  strokeWidth={isActive || isHover ? 2 : 1}
                />

                {/* marker (secondary) */}
                <g transform={`translate(${p.x} ${p.y})`}>
                  <circle
                    r={isActive ? 7.5 : 6}
                    fill={c.glow}
                    opacity={0.9}
                  />
                  <circle
                    r={isActive ? 16 : 14}
                    fill="none"
                    stroke={c.glow}
                    strokeWidth="1.2"
                    opacity={isActive ? 0.55 : 0.25}
                    className={isActive ? "pulse-glow" : undefined}
                  />
                </g>

                {/* hover label */}
                {(isHover || isActive) && (
                  <g transform={`translate(${p.x + 18} ${p.y - 34})`}>
                    <rect
                      x={0}
                      y={0}
                      width={86}
                      height={22}
                      rx={10}
                      fill="rgba(0,0,0,0.38)"
                      stroke="rgba(255,255,255,0.10)"
                    />
                    <text
                      x={10}
                      y={15}
                      fontSize={12}
                      fill="#f8f3ea"
                    >
                      {TAIWAN_CITY_LABELS[city]}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

