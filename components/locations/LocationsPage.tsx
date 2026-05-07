"use client";

import { useMemo, useState } from "react";
import type { Location, Session } from "@/types/cms";
import { PageHero } from "@/components/layout/PageHero";
import { LocationFilters } from "@/components/locations/LocationFilters";
import { LocationCard } from "@/components/locations/LocationCard";

type Props = {
  locations: Location[];
  sessionsByLocationId: Record<string, Session[]>;
};

export function LocationsPage({ locations, sessionsByLocationId }: Props) {
  const [city, setCity] = useState<string>("all");
  const [serviceType, setServiceType] = useState<
    "all" | "teaching" | "dropin" | "both"
  >("all");

  const cities = useMemo(() => {
    const set = new Set<string>();
    for (const l of locations) set.add(l.city);
    return ["all", ...Array.from(set).sort((a, b) => a.localeCompare(b, "zh-Hant"))];
  }, [locations]);

  const filtered = useMemo(() => {
    return locations.filter((l) => {
      if (city !== "all" && l.city !== city) return false;
      if (serviceType === "all") return true;
      if (serviceType === "both") return l.service_type === "both";
      if (l.service_type === "both") return true;
      return l.service_type === serviceType;
    });
  }, [locations, city, serviceType]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 md:py-12">
      <PageHero
        title="據點總覽"
        subtitle="查看合作場地、服務類型與近期場次摘要；尚未提供線上報名，請先用聯絡我們洽詢。"
      />

      <LocationFilters
        cities={cities}
        city={city}
        onCityChange={setCity}
        serviceType={serviceType}
        onServiceTypeChange={setServiceType}
      />

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 px-6 py-12 text-center text-sm text-[#8B735C] shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md">
          目前沒有符合條件的據點資料。
        </div>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {filtered.map((loc) => (
            <LocationCard
              key={loc.id}
              location={loc}
              sessions={sessionsByLocationId[loc.id] ?? []}
            />
          ))}
        </div>
      )}
    </div>
  );
}

