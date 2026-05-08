"use client";

import type { MapTabType } from "@/types/cms";
import type { TaiwanCountyName } from "@/components/home/taiwan-county-paths";
import { TAIWAN_COUNTY_PATHS } from "@/components/home/taiwan-county-paths";
import { useEffect, useMemo, useRef, useState } from "react";

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
      glow: "#6FA37B",
      glowSoft: "rgba(111,163,123,0.26)",
      soft: "rgba(111,163,123,0.26)",
      soft2: "rgba(111,163,123,0.18)",
    };
  }
  return {
    glow: "#B98552",
    glowSoft: "rgba(214,168,108,0.34)",
    soft: "rgba(214,168,108,0.34)",
    soft2: "rgba(214,168,108,0.22)",
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

function clampValue(value: number, min: number, max: number) {
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
  const [userZoom, setUserZoom] = useState(1);
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
    setUserZoom(1);
    dragStartRef.current.moved = false;
  }, [activeTab]);

  useEffect(() => {
    // Selecting a county should re-center to its focus.
    setPan({ x: 0, y: 0 });
    setUserZoom(1);
    dragStartRef.current.moved = false;
  }, [activeCity]);

  const DEFAULT_FOCUS = { scale: 1, x: 0, y: 0 };
  const rawFocus =
    activeCity != null
      ? TAIWAN_COUNTY_PATHS.find((p) => p.name === activeCity)?.focus ?? null
      : null;
  const safeFocus = rawFocus ?? DEFAULT_FOCUS;
  const safeScale = Math.min(Math.max(safeFocus.scale ?? 1, 1), 2.2);
  const safeX = clampValue(Number(safeFocus.x ?? 0) * 0.5, -180, 180);
  const safeY = clampValue(Number(safeFocus.y ?? 0) * 0.5, -200, 200);

  const finalScale = clampValue(safeScale * userZoom, 1, 2.8);
  const panLimit = 80 + (finalScale - 1) * 140;
  const panX = clampPan(pan.x, -panLimit, panLimit);
  const panY = clampPan(pan.y, -panLimit, panLimit);
  const transform = `translate(${safeX + panX}px, ${safeY + panY}px) scale(${finalScale})`;

  const zoomCaps = useMemo(() => {
    const maxZoom = clampValue(2.8 / Math.max(1, safeScale), 1, 2.8);
    return { min: 1, max: maxZoom };
  }, [safeScale]);

  return (
    <div className="relative h-[390px] w-full overflow-hidden touch-none sm:h-[430px] md:h-[540px] lg:h-[620px]">
      {/* Zoom controls (HTML overlay; avoid foreignObject for mobile reliability) */}
      <div className="absolute right-4 top-4 z-20">
        <div className="flex items-center gap-2 rounded-full border border-[rgba(90,62,43,0.16)] bg-[#FFF8ED]/85 p-1 text-[#3A2A1E] shadow-sm backdrop-blur">
          <button
            type="button"
            aria-label="放大地圖"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              setUserZoom((z) =>
                clampValue(Number((z + 0.2).toFixed(2)), zoomCaps.min, zoomCaps.max)
              );
            }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition hover:bg-[#F3DFC3]"
          >
            ＋
          </button>
          <button
            type="button"
            aria-label="縮小地圖"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              setUserZoom((z) =>
                clampValue(Number((z - 0.2).toFixed(2)), zoomCaps.min, zoomCaps.max)
              );
            }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition hover:bg-[#F3DFC3]"
          >
            －
          </button>
          <button
            type="button"
            aria-label="重置視角"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              setPan({ x: 0, y: 0 });
              setUserZoom(1);
              dragStartRef.current.moved = false;
            }}
            className="inline-flex h-9 items-center justify-center rounded-full px-3 text-xs font-semibold transition hover:bg-[#F3DFC3]"
          >
            重置
          </button>
        </div>
      </div>

      {/* Background scan / rings */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(90,62,43,0.12)] opacity-60 blur-[0.2px] orbit-scan md:h-[620px] md:w-[620px]"
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
          <text x={20} y={734} fontSize={12} fill="rgba(111,90,70,0.92)">
            拖拉地圖可查看細節
          </text>
        </g>
        <g className="pointer-events-none md:hidden">
          <text x={20} y={734} fontSize={12} fill="rgba(111,90,70,0.92)">
            可拖拉地圖查看縣市輪廓
          </text>
        </g>

        {activeCity ? (
          <g className="md:hidden">
            <rect
              x={16}
              y={16}
              width={130}
              height={28}
              rx={12}
              fill="rgba(255,248,237,0.92)"
              stroke="rgba(90,62,43,0.16)"
            />
            <text x={28} y={35} fontSize={12} fill="#3A2A1E">
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
              fill="rgba(255,248,237,0.78)"
              stroke="rgba(90,62,43,0.16)"
              strokeWidth={1.2}
            />
            <text
              x={58}
              y={574}
              fontSize={12}
              fill="rgba(58,42,30,0.92)"
            >
              離島
            </text>
          </g>

          {TAIWAN_COUNTY_PATHS.map((county) => {
            const enabled = cities.includes(county.name);
            const isActive = isActiveCounty(county.name, activeCity);
            const isHover = hoverCity === county.name;
            const isDim = Boolean(displayCity) && displayCity !== county.name;

            // 023 明亮底：disabled 仍需清楚可見
            const disabledFill = "rgba(90,62,43,0.08)";
            const disabledStroke = "rgba(90,62,43,0.28)";

            const enabledFill =
              activeTab === "dropin"
                ? "rgba(111,163,123,0.26)"
                : "rgba(214,168,108,0.34)";
            const enabledStroke = activeTab === "dropin" ? "#6FA37B" : "#B98552";

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
              : "rgba(90,62,43,0.42)";
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
                    fill={
                      enabled
                        ? activeTab === "dropin"
                          ? "rgba(111,163,123,0.30)"
                          : "rgba(214,168,108,0.38)"
                        : "rgba(90,62,43,0.10)"
                    }
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
                      fill="#FFF8ED"
                      stroke="rgba(90,62,43,0.16)"
                    />
                    <text x={10} y={14} fontSize={12} fill="#3A2A1E">
                      {normalizeCountyName(county.name)}
                    </text>
                    <text x={10} y={26} fontSize={11} fill="#6F5A46">
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

