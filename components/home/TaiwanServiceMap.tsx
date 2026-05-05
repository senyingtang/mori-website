"use client";

import { useMemo, useState } from "react";
import type { Location, MapCitySetting, MapTabType, Session } from "@/types/cms";
import { LocationHoverCard } from "@/components/home/LocationHoverCard";

type Props = {
  mapCities: MapCitySetting[];
  locations: Location[];
  sessions: Session[];
};

const CITY_POINTS: Record<string, { x: number; y: number }> = {
  桃園市: { x: 46, y: 28 },
  宜蘭縣: { x: 62, y: 36 },
  台北市: { x: 55, y: 22 },
  新北市: { x: 52, y: 26 },
  台中市: { x: 39, y: 50 },
  高雄市: { x: 34, y: 82 },
};

function tabLabel(tab: MapTabType) {
  return tab === "teaching" ? "教學" : "臨打";
}

export function TaiwanServiceMap({ mapCities, locations, sessions }: Props) {
  const [activeTab, setActiveTab] = useState<MapTabType>("teaching");
  const [activeCity, setActiveCity] = useState<string | null>(null);

  const filteredCities = useMemo(() => {
    return mapCities
      .filter((c) => c.is_enabled && c.tab_type === activeTab)
      .sort((a, b) => a.sort_order - b.sort_order);
  }, [mapCities, activeTab]);

  const activeSetting = useMemo(() => {
    if (!activeCity) return null;
    return filteredCities.find((c) => c.city === activeCity) ?? null;
  }, [filteredCities, activeCity]);

  const theme = activeTab === "teaching"
    ? { pill: "border-sky-400/40 bg-sky-500/15 text-sky-100", glow: "rgba(37,99,235,0.45)" }
    : { pill: "border-rose-400/40 bg-rose-500/15 text-rose-100", glow: "rgba(239,68,68,0.45)" };

  if (mapCities.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-[0_0_40px_rgba(168,85,247,0.18)] backdrop-blur-md">
        <p className="text-sm text-white/70">
          目前尚未開放據點，請稍後再回來查看。
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setActiveTab("teaching");
            setActiveCity(null);
          }}
          className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
            activeTab === "teaching"
              ? "border-sky-400/45 bg-sky-500/20 text-sky-100"
              : "border-white/10 bg-white/5 text-white/55 hover:bg-white/10"
          }`}
        >
          教學
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("dropin");
            setActiveCity(null);
          }}
          className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
            activeTab === "dropin"
              ? "border-rose-400/45 bg-rose-500/20 text-rose-100"
              : "border-white/10 bg-white/5 text-white/55 hover:bg-white/10"
          }`}
        >
          臨打
        </button>
        <span className="ml-auto hidden text-[11px] text-white/35 md:inline">
          Hover / 點擊縣市查看據點
        </span>
      </div>

      {/* Desktop: SVG map */}
      <div className="hidden md:block">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-[0_0_40px_rgba(168,85,247,0.18)] backdrop-blur-md">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 70%, rgba(168,85,247,0.14), transparent 55%)",
            }}
          />

          <div className="relative grid gap-5 lg:grid-cols-[1fr_360px] lg:items-start">
            <div className="relative">
              <svg viewBox="0 0 100 120" className="h-[340px] w-full">
                {/* Taiwan silhouette (simplified blob) */}
                <defs>
                  <linearGradient id="twFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(168,85,247,0.22)" />
                    <stop offset="100%" stopColor="rgba(30,16,61,0.25)" />
                  </linearGradient>
                </defs>
                <path
                  d="M58 8 C65 15, 70 24, 68 34 C66 44, 70 52, 66 62 C62 74, 58 86, 52 98 C47 108, 41 112, 36 106 C30 98, 30 86, 33 74 C36 62, 33 52, 36 42 C39 30, 44 18, 52 10 C55 7, 56 7, 58 8 Z"
                  fill="url(#twFill)"
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="1"
                />

                {/* Radar rings */}
                <g opacity="0.35">
                  <circle cx="50" cy="108" r="10" fill="none" stroke="rgba(168,85,247,0.35)" strokeWidth="0.6" />
                  <circle cx="50" cy="108" r="18" fill="none" stroke="rgba(168,85,247,0.22)" strokeWidth="0.6" />
                  <circle cx="50" cy="108" r="26" fill="none" stroke="rgba(168,85,247,0.14)" strokeWidth="0.6" />
                </g>

                {/* City points */}
                {filteredCities.map((c) => {
                  const p = CITY_POINTS[c.city];
                  if (!p) return null;
                  const isActive = activeCity === c.city;
                  return (
                    <g
                      key={`${c.tab_type}-${c.city}`}
                      onMouseEnter={() => setActiveCity(c.city)}
                      onClick={() => setActiveCity(c.city)}
                      style={{ cursor: "pointer" }}
                    >
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={isActive ? 2.8 : 2.2}
                        fill={c.glow_color || (activeTab === "teaching" ? "#2563EB" : "#EF4444")}
                        opacity="0.95"
                      />
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={isActive ? 6.8 : 5.5}
                        fill="none"
                        stroke={c.glow_color || (activeTab === "teaching" ? "#2563EB" : "#EF4444")}
                        strokeWidth="0.8"
                        opacity={isActive ? 0.55 : 0.35}
                      />
                      {/* ping halo */}
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={9}
                        fill="none"
                        stroke={c.glow_color || (activeTab === "teaching" ? "#2563EB" : "#EF4444")}
                        strokeWidth="0.5"
                        opacity="0.18"
                      />
                      {isActive ? (
                        <text
                          x={p.x + 2.5}
                          y={p.y - 2.5}
                          fontSize="4"
                          fill="rgba(255,255,255,0.8)"
                        >
                          {c.city}
                        </text>
                      ) : null}
                    </g>
                  );
                })}
              </svg>

              <p className="mt-3 text-center text-[11px] text-white/40">
                {tabLabel(activeTab)}：發光縣市由 <code className="rounded bg-black/30 px-1">map_city_settings</code> 控制
              </p>
            </div>

            <div className="relative">
              {activeSetting ? (
                <LocationHoverCard
                  citySetting={activeSetting}
                  locations={locations}
                  sessions={sessions}
                />
              ) : (
                <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 text-sm text-white/60 backdrop-blur-md">
                  <p className="font-semibold text-white/80">提示</p>
                  <p className="mt-2">
                    將滑鼠移到發光縣市點，或點擊縣市點，即可查看該縣市的據點卡片。
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: chips + card list */}
      <div className="md:hidden">
        <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-[0_0_40px_rgba(168,85,247,0.18)] backdrop-blur-md">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/45">
            選擇縣市
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {filteredCities.map((c) => (
              <button
                key={`${c.tab_type}-${c.city}`}
                type="button"
                onClick={() => setActiveCity(c.city)}
                className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
                  activeCity === c.city
                    ? theme.pill
                    : "border-white/10 bg-white/5 text-white/70"
                }`}
                style={
                  activeCity === c.city
                    ? { boxShadow: `0 0 22px ${theme.glow}` }
                    : undefined
                }
              >
                {c.city}
              </button>
            ))}
          </div>

          <div className="mt-5">
            {activeSetting ? (
              <LocationHoverCard
                citySetting={activeSetting}
                locations={locations}
                sessions={sessions}
              />
            ) : (
              <p className="text-sm text-white/55">
                點選上方縣市 chips 以查看據點資訊。
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

