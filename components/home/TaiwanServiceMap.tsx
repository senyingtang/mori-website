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

  const firstEnabledCity = supportedCities[0] ?? null;

  const displayCity =
    hoverCity && supportedCities.includes(hoverCity) ? hoverCity : activeCity;

  const activeSetting = useMemo(() => {
    if (!displayCity) return null;
    return filteredCities.find((c) => c.countyName === displayCity) ?? null;
  }, [filteredCities, displayCity]);

  useEffect(() => {
    // 切換 tab：重設到該 tab 第一個 enabled city
    setActiveCity(firstEnabledCity);
    setHoverCity(null);
  }, [activeTab, firstEnabledCity]);

  useEffect(() => {
    // 若 activeCity 為空或不在本 tab 的 enabled counties，才 fallback 到第一個 enabled
    if (!firstEnabledCity) return;
    if (!activeCity || !supportedCities.includes(activeCity)) {
      setActiveCity(firstEnabledCity);
      setHoverCity(null);
    }
  }, [activeCity, supportedCities, firstEnabledCity]);

  const theme =
    activeTab === "teaching"
      ? {
          pill: "border-[rgba(185,133,82,0.28)] bg-[rgba(214,168,108,0.22)] text-[#5A3E2B]",
          glow: "rgba(185,133,82,0.32)",
        }
      : {
          pill: "border-[rgba(111,163,123,0.26)] bg-[rgba(111,163,123,0.16)] text-[#3A2A1E]",
          glow: "rgba(111,163,123,0.26)",
        };

  if (mapCities.length === 0) {
    return (
      <div className="rounded-3xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.72)] p-6 shadow-[0_18px_52px_rgba(90,62,43,0.10)] backdrop-blur-md">
        <p className="text-sm text-[#6F5A46]">
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
              ? "border-[rgba(185,133,82,0.28)] bg-[rgba(214,168,108,0.22)] text-[#5A3E2B]"
              : "border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.62)] text-[#6F5A46] hover:bg-[rgba(255,248,237,0.86)]"
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
              ? "border-[rgba(111,163,123,0.26)] bg-[rgba(111,163,123,0.16)] text-[#3A2A1E]"
              : "border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.62)] text-[#6F5A46] hover:bg-[rgba(255,248,237,0.86)]"
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
          onSelectCity={(city) => {
            setActiveCity(city);
            setHoverCity(null);
          }}
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
                  : "border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.62)] text-[#5A3E2B]"
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
            <p className="text-sm text-[#6F5A46]">點選上方縣市以查看據點資訊。</p>
          )}
        </div>
      </div>
    </div>
  );
}

