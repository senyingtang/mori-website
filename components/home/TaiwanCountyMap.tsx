"use client";

import type { MapTabType } from "@/types/cms";
import type { TaiwanCountyName } from "@/components/home/taiwan-county-paths";
import { TAIWAN_COUNTY_PATHS } from "@/components/home/taiwan-county-paths";

type Props = {
  activeTab: MapTabType;
  activeCity: TaiwanCountyName | null;
  hoverCity: TaiwanCountyName | null;
  cities: TaiwanCountyName[];
  onHoverCity: (city: TaiwanCountyName) => void;
  onLeaveCity: () => void;
  onSelectCity: (city: TaiwanCountyName) => void;
};

function colors(activeTab: MapTabType) {
  if (activeTab === "dropin") {
    return {
      glow: "#8bbf9f",
      glowSoft: "rgba(139,191,159,0.32)",
      soft: "rgba(139,191,159,0.20)",
      soft2: "rgba(139,191,159,0.16)",
    };
  }
  return {
    glow: "#e7c79c",
    glowSoft: "rgba(205,162,116,0.35)",
    soft: "rgba(205,162,116,0.22)",
    soft2: "rgba(205,162,116,0.16)",
  };
}

function isActiveCounty(
  county: TaiwanCountyName,
  activeCounty: TaiwanCountyName | null
) {
  return activeCounty === county;
}

function normalizeCountyName(name: string) {
  return name.replace("臺", "台").trim();
}

const LABEL_OFFSET: Partial<Record<TaiwanCountyName, { dx: number; dy: number }>> =
  {
    // North cluster: avoid overlaps
    "台北市": { dx: 14, dy: -44 },
    "新北市": { dx: 20, dy: -20 },
    "基隆市": { dx: 20, dy: -52 },
    "桃園市": { dx: 8, dy: -12 },
    "新竹市": { dx: 12, dy: -18 },
    "新竹縣": { dx: 6, dy: -10 },
    "宜蘭縣": { dx: 18, dy: -10 },
  };

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
  const displayCity = hoverCity ?? activeCity;

  const activeFocus =
    activeCity != null
      ? TAIWAN_COUNTY_PATHS.find((p) => p.name === activeCity)?.focus ?? null
      : null;
  const transform = activeFocus
    ? `translate(${activeFocus.x}px, ${activeFocus.y}px) scale(${activeFocus.scale})`
    : "translate(0px, 0px) scale(1)";

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
        {activeCity ? (
          <g className="md:hidden">
            <rect
              x={16}
              y={16}
              width={130}
              height={28}
              rx={12}
              fill="rgba(0,0,0,0.38)"
              stroke="rgba(255,255,255,0.10)"
            />
            <text x={28} y={35} fontSize={12} fill="rgba(248,243,234,0.92)">
              {normalizeCountyName(activeCity)}
            </text>
          </g>
        ) : null}
        <defs>
          <linearGradient id="twCountyFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
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
          {/* Island inset frame (Penghu / Kinmen / Lienchiang) */}
          <g className="pointer-events-none">
            <rect
              x={42}
              y={548}
              width={200}
              height={190}
              rx={18}
              fill="rgba(0,0,0,0.18)"
              stroke="rgba(248,243,234,0.18)"
              strokeWidth={1.2}
            />
            <text
              x={58}
              y={574}
              fontSize={12}
              fill="rgba(248,243,234,0.72)"
            >
              離島
            </text>
          </g>

          {TAIWAN_COUNTY_PATHS.map((county) => {
            const enabled = cities.includes(county.name);
            const isActive = isActiveCounty(county.name, activeCity);
            const isHover = hoverCity === county.name;
            const isDim = Boolean(displayCity) && displayCity !== county.name;

            const disabledFill = "rgba(248,243,234,0.055)";
            const disabledStroke = "rgba(248,243,234,0.16)";

            const fill = isActive
              ? c.soft
              : enabled
                ? c.soft
                : disabledFill;

            const stroke = isActive || isHover
              ? c.glow
              : enabled
                ? c.glow
                : disabledStroke;

            const disabledHoverStroke = "rgba(248,243,234,0.26)";
            const hoverStroke = enabled ? c.glow : disabledHoverStroke;
            const off = LABEL_OFFSET[county.name] ?? { dx: 10, dy: -34 };

            return (
              <g
                key={county.name}
                onMouseEnter={() => {
                  onHoverCity(county.name);
                }}
                onMouseLeave={() => onLeaveCity()}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!enabled) return;
                  onSelectCity(county.name);
                }}
                style={{ cursor: enabled ? "pointer" : "not-allowed" }}
                opacity={isDim ? 0.55 : 1}
              >
                {(isActive || isHover) ? (
                  <path
                    d={county.d}
                    fill={enabled ? c.glowSoft : "rgba(255,255,255,0.06)"}
                    opacity={0.85}
                    filter="url(#cityGlow)"
                  />
                ) : null}
                <path
                  d={county.d}
                  fill={fill}
                  stroke={isHover ? hoverStroke : stroke}
                  strokeWidth={isActive ? 2.4 : isHover ? 1.7 : enabled ? 1.25 : 1.1}
                />

                {(isHover || isActive) ? (
                  <g
                    className="hidden md:block"
                    transform={`translate(${county.label.x + off.dx} ${county.label.y + off.dy})`}
                  >
                    <rect
                      x={0}
                      y={0}
                      width={112}
                      height={30}
                      rx={10}
                      fill="rgba(0,0,0,0.38)"
                      stroke="rgba(255,255,255,0.10)"
                    />
                    <text x={10} y={14} fontSize={12} fill="#f8f3ea">
                      {normalizeCountyName(county.name)}
                    </text>
                    <text x={10} y={26} fontSize={11} fill="rgba(248,243,234,0.68)">
                      {enabled
                        ? activeTab === "dropin"
                          ? "查看臨打場次"
                          : "查看教學據點"
                        : "尚未開放據點"}
                    </text>
                  </g>
                ) : null}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

