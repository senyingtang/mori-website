"use client";

import type { MapTabType } from "@/types/cms";
import type { TaiwanCountyName } from "@/components/home/taiwan-county-paths";
import { TAIWAN_COUNTY_PATHS } from "@/components/home/taiwan-county-paths";
import { useEffect, useRef, useState } from "react";

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

function clampPan(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
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

  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({
    pointerId: null as number | null,
    startX: 0,
    startY: 0,
    panX: 0,
    panY: 0,
    moved: false,
  });

  useEffect(() => {
    // Switching tab should reset user pan so focus stays predictable.
    setPan({ x: 0, y: 0 });
    dragStartRef.current.moved = false;
  }, [activeTab]);

  useEffect(() => {
    // Selecting a county should re-center to its focus.
    setPan({ x: 0, y: 0 });
    dragStartRef.current.moved = false;
  }, [activeCity]);

  const DEFAULT_FOCUS = { scale: 1, x: 0, y: 0 };
  const rawFocus =
    activeCity != null
      ? TAIWAN_COUNTY_PATHS.find((p) => p.name === activeCity)?.focus ?? null
      : null;
  const safeFocus = rawFocus ?? DEFAULT_FOCUS;
  const safeScale = Math.min(Math.max(safeFocus.scale ?? 1, 1), 2.2);
  // Prevent accidental huge translate that can move the whole map out of view.
  const clamp = (v: number, min: number, max: number) =>
    Math.max(min, Math.min(max, v));
  const safeX = clamp(Number(safeFocus.x ?? 0) * 0.5, -180, 180);
  const safeY = clamp(Number(safeFocus.y ?? 0) * 0.5, -200, 200);

  const panLimit = 80 + (safeScale - 1) * 120;
  const panX = clampPan(pan.x, -panLimit, panLimit);
  const panY = clampPan(pan.y, -panLimit, panLimit);
  const transform = `translate(${safeX + panX}px, ${safeY + panY}px) scale(${safeScale})`;

  return (
    <div className="relative h-[390px] w-full overflow-hidden touch-none sm:h-[430px] md:h-[540px] lg:h-[620px]">
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
        preserveAspectRatio="xMidYMid meet"
        className={[
          "relative block h-full w-full max-w-full select-none map-float",
          isDragging ? "cursor-grabbing" : "cursor-grab",
        ].join(" ")}
        role="img"
        aria-label="台灣縣市服務地圖"
        onPointerDown={(e) => {
          // Only react to primary pointer button (mouse left) / touch.
          if (e.pointerType === "mouse" && e.button !== 0) return;
          setIsDragging(true);

          dragStartRef.current.pointerId = e.pointerId;
          dragStartRef.current.startX = e.clientX;
          dragStartRef.current.startY = e.clientY;
          dragStartRef.current.panX = panX;
          dragStartRef.current.panY = panY;
          dragStartRef.current.moved = false;

          try {
            e.currentTarget.setPointerCapture(e.pointerId);
          } catch {
            // ignore
          }
        }}
        onPointerMove={(e) => {
          const ds = dragStartRef.current;
          if (!isDragging) return;
          if (ds.pointerId == null || ds.pointerId !== e.pointerId) return;

          const dx = e.clientX - ds.startX;
          const dy = e.clientY - ds.startY;
          const DRAG_THRESHOLD = 5;
          if (Math.abs(dx) + Math.abs(dy) > DRAG_THRESHOLD) ds.moved = true;

          const nextX = clampPan(ds.panX + dx, -panLimit, panLimit);
          const nextY = clampPan(ds.panY + dy, -panLimit, panLimit);
          setPan({ x: nextX, y: nextY });
        }}
        onPointerUp={(e) => {
          const ds = dragStartRef.current;
          if (ds.pointerId === e.pointerId) {
            ds.pointerId = null;
          }
          setIsDragging(false);
          try {
            e.currentTarget.releasePointerCapture(e.pointerId);
          } catch {
            // ignore
          }
          // Let click handlers run first, then clear moved.
          setTimeout(() => {
            dragStartRef.current.moved = false;
          }, 0);
        }}
        onPointerCancel={(e) => {
          const ds = dragStartRef.current;
          if (ds.pointerId === e.pointerId) {
            ds.pointerId = null;
          }
          setIsDragging(false);
          try {
            e.currentTarget.releasePointerCapture(e.pointerId);
          } catch {
            // ignore
          }
          dragStartRef.current.moved = false;
        }}
        onClick={(e) => {
          // click background to clear hover (optional)
          if (e.currentTarget === e.target) onLeaveCity();
        }}
      >
        {TAIWAN_COUNTY_PATHS.length === 0 ? (
          <g className="pointer-events-none">
            <text
              x={300}
              y={380}
              textAnchor="middle"
              fontSize={14}
              fill="rgba(248,243,234,0.78)"
            >
              地圖資料載入中
            </text>
          </g>
        ) : null}

        {/* Small hint + reset button */}
        <g className="pointer-events-none hidden md:block">
          <text x={20} y={734} fontSize={12} fill="rgba(248,243,234,0.68)">
            拖拉地圖可查看細節
          </text>
        </g>
        <g className="pointer-events-none md:hidden">
          <text x={20} y={734} fontSize={12} fill="rgba(248,243,234,0.68)">
            可拖拉地圖查看縣市輪廓
          </text>
        </g>

        <foreignObject x={468} y={16} width={120} height={40}>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setPan({ x: 0, y: 0 });
              }}
              className="pointer-events-auto rounded-full border border-[rgba(255,255,255,0.10)] bg-[rgba(0,0,0,0.28)] px-3 py-1 text-xs text-[rgba(248,243,234,0.92)] backdrop-blur hover:border-[rgba(205,162,116,0.45)]"
            >
              重置視角
            </button>
          </div>
        </foreignObject>
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

            // Debug-safe baseline styles: map must always be visible.
            const disabledFill = "rgba(248,243,234,0.10)";
            const disabledStroke = "rgba(248,243,234,0.35)";

            const enabledFill =
              activeTab === "dropin"
                ? "rgba(139,191,159,0.22)"
                : "rgba(205,162,116,0.25)";
            const enabledStroke = activeTab === "dropin" ? "#8bbf9f" : "#e7c79c";

            const fill = isActive
              ? enabledFill
              : enabled
                ? enabledFill
                : disabledFill;

            const stroke = isActive
              ? enabledStroke
              : enabled
                ? enabledStroke
                : disabledStroke;

            const hoverStroke = enabled
              ? enabledStroke
              : "rgba(248,243,234,0.55)";
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
                  if (dragStartRef.current.moved) return;
                  if (!enabled) return;
                  onSelectCity(county.name);
                }}
                style={{ cursor: enabled ? "pointer" : "not-allowed" }}
                opacity={isDim ? 0.82 : 1}
              >
                {(isActive || isHover) ? (
                  <path
                    d={county.d}
                    fill={enabled ? (activeTab === "dropin" ? "rgba(139,191,159,0.32)" : "rgba(205,162,116,0.35)") : "rgba(255,255,255,0.10)"}
                    opacity={0.9}
                    filter={isActive ? "url(#cityGlow)" : undefined}
                  />
                ) : null}
                <path
                  d={county.d}
                  fill={fill}
                  stroke={isHover ? hoverStroke : stroke}
                  strokeWidth={isActive ? 2 : isHover ? 1.4 : enabled ? 1.4 : 1}
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

