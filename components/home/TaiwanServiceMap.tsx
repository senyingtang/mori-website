"use client";

import { useEffect, useMemo, useState } from "react";
import type { Location, MapCitySetting, MapTabType, Session } from "@/types/cms";
import { LocationHoverCard } from "@/components/home/LocationHoverCard";
import { TaiwanCountyMap } from "@/components/home/TaiwanCountyMap";
import type { TaiwanCountyName } from "@/components/home/taiwan-county-paths";
import { TAIWAN_COUNTY_PATHS } from "@/components/home/taiwan-county-paths";

type Props = {
  mapCities: MapCitySetting[];
  locations: Location[];
  sessions: Session[];
};

function normalizeCountyName(name: string) {
  return name.replace("臺", "台").trim();
}

const ALL_COUNTIES = TAIWAN_COUNTY_PATHS.map((p) => p.name);

function toCountyName(s: string): TaiwanCountyName | null {
  const n = normalizeCountyName(s);
  return (ALL_COUNTIES as readonly string[]).includes(n) ? (n as TaiwanCountyName) : null;
}

export function TaiwanServiceMap({ mapCities, locations, sessions }: Props) {
  const [activeTab, setActiveTab] = useState<MapTabType>("teaching");
  const [activeCity, setActiveCity] = useState<TaiwanCountyName | null>(null);
  const [hoverCity, setHoverCity] = useState<TaiwanCountyName | null>(null);

  const filteredCities = useMemo(() => {
    return mapCities
      .filter((c) => c.is_enabled && c.tab_type === activeTab)
      .map((c) => ({ ...c, countyName: toCountyName(c.city) }))
      .filter((c) => c.countyName != null)
      .sort((a, b) => a.sort_order - b.sort_order) as Array<
      MapCitySetting & { countyName: TaiwanCountyName }
    >;
  }, [mapCities, activeTab]);

  const supportedCities = useMemo(() => {
    return filteredCities.map((c) => c.countyName);
  }, [filteredCities]);

  const displayCity =
    hoverCity && supportedCities.includes(hoverCity) ? hoverCity : activeCity;

  const activeSetting = useMemo(() => {
    if (!displayCity) return null;
    return filteredCities.find((c) => c.countyName === displayCity) ?? null;
  }, [filteredCities, displayCity]);

  useEffect(() => {
    // 初始化：activeTab=teaching，activeCity=第一個 enabled city
    if (!activeCity) {
      setActiveCity(filteredCities[0]?.countyName ?? null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // 切換 tab：切到該 tab 第一個 enabled city
    setActiveCity(filteredCities[0]?.countyName ?? null);
    setHoverCity(null);
  }, [activeTab, filteredCities]);

  useEffect(() => {
    // 若 activeCity 不在本 tab 的 enabled counties，改成第一個 enabled
    if (activeCity && supportedCities.length > 0 && !supportedCities.includes(activeCity)) {
      setActiveCity(supportedCities[0] ?? null);
    }
  }, [activeCity, supportedCities]);

  const theme =
    activeTab === "teaching"
      ? {
          pill: "border-[rgba(205,162,116,0.45)] bg-brand-purple/15 text-brand-neon-purple",
          glow: "rgba(205,162,116,0.45)",
        }
      : {
          pill: "border-[rgba(139,191,159,0.55)] bg-[rgba(139,191,159,0.14)] text-[#f8f3ea]",
          glow: "rgba(139,191,159,0.42)",
        };

  if (mapCities.length === 0) {
    return (
      <div className="rounded-3xl border border-[rgba(255,255,255,0.10)] bg-white/[0.06] p-6 shadow-[0_0_40px_rgba(31,20,16,0.14)] backdrop-blur-md">
        <p className="text-sm text-white/70">
          目前尚未開放據點，請稍後再回來查看。
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setActiveTab("teaching");
          }}
          className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
            activeTab === "teaching"
              ? "border-[rgba(205,162,116,0.45)] bg-brand-purple/15 text-brand-neon-purple"
              : "border-white/10 bg-white/5 text-white/55 hover:bg-white/10"
          }`}
        >
          教學
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("dropin");
          }}
          className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
            activeTab === "dropin"
              ? "border-[rgba(139,191,159,0.55)] bg-[rgba(139,191,159,0.14)] text-[#f8f3ea]"
              : "border-white/10 bg-white/5 text-white/55 hover:bg-white/10"
          }`}
        >
          臨打
        </button>
      </div>

      {/* Map + (desktop) floating card */}
      <div className="relative mt-4">
        <TaiwanCountyMap
          activeTab={activeTab}
          activeCity={activeCity}
          hoverCity={hoverCity}
          cities={supportedCities}
          onHoverCity={(city) => setHoverCity(city)}
          onLeaveCity={() => setHoverCity(null)}
          onSelectCity={(city) => setActiveCity(city)}
        />

        {/* Desktop floating card */}
        <div
          className={`pointer-events-none absolute hidden w-[min(340px,42%)] md:block ${
            activeCity && ["高雄市", "台南市", "屏東縣"].includes(activeCity)
              ? "top-5 right-5"
              : activeCity && ["台北市", "新北市", "基隆市", "宜蘭縣"].includes(activeCity)
                ? "bottom-5 right-5"
                : "bottom-5 right-5"
          }`}
        >
          <div className="pointer-events-auto">
            {activeSetting ? (
              <div className="max-h-[min(520px,calc(100%-2.5rem))] overflow-y-auto">
                <LocationHoverCard
                  citySetting={activeSetting}
                  locations={locations}
                  sessions={sessions}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Mobile/tablet chips + stacked card */}
      <div className="mt-4 md:mt-5">
        <div className="flex flex-wrap gap-2 md:hidden">
          {supportedCities.map((city) => (
            <button
              key={`${activeTab}-${city}`}
              type="button"
              onClick={() => setActiveCity(city)}
              className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
                activeCity === city
                  ? theme.pill
                  : "border-white/10 bg-white/5 text-white/70"
              }`}
              style={
                activeCity === city ? { boxShadow: `0 0 22px ${theme.glow}` } : undefined
              }
            >
              {city}
            </button>
          ))}
        </div>

        <div className="mt-4 md:hidden">
          {activeSetting ? (
            <LocationHoverCard
              citySetting={activeSetting}
              locations={locations}
              sessions={sessions}
            />
          ) : (
            <p className="text-sm text-white/55">點選上方縣市以查看據點資訊。</p>
          )}
        </div>
      </div>
    </div>
  );
}

