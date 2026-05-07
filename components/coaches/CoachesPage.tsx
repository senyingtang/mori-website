"use client";

import { useMemo, useState } from "react";
import type { Coach } from "@/types/cms";
import { PageHero } from "@/components/layout/PageHero";
import { CoachFilters } from "@/components/coaches/CoachFilters";
import { CoachCard } from "@/components/coaches/CoachCard";

type Props = {
  coaches: Coach[];
};

function uniqSorted(arr: string[]) {
  return Array.from(new Set(arr.filter(Boolean))).sort((a, b) =>
    a.localeCompare(b, "zh-Hant")
  );
}

export function CoachesPage({ coaches }: Props) {
  const [city, setCity] = useState("all");
  const [specialty, setSpecialty] = useState("all");
  const [levelTag, setLevelTag] = useState("all");

  const options = useMemo(() => {
    const cities = uniqSorted(coaches.map((c) => c.city ?? ""));
    const specialties = uniqSorted(coaches.flatMap((c) => c.specialties ?? []));
    const levelTags = uniqSorted(coaches.flatMap((c) => c.level_tags ?? []));
    return {
      cities: ["all", ...cities],
      specialties: ["all", ...specialties],
      levelTags: ["all", ...levelTags],
    };
  }, [coaches]);

  const filtered = useMemo(() => {
    return coaches.filter((c) => {
      if (city !== "all" && (c.city ?? null) !== city) return false;
      if (specialty !== "all") {
        if (!(c.specialties ?? []).includes(specialty)) return false;
      }
      if (levelTag !== "all") {
        if (!(c.level_tags ?? []).includes(levelTag)) return false;
      }
      return true;
    });
  }, [coaches, city, specialty, levelTag]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 md:py-12">
      <PageHero
        title="教練團"
        subtitle="依地區、專長與程度快速找到適合的教練；目前不提供線上預約，請先用預約／諮詢聯絡。"
      />

      <CoachFilters
        cities={options.cities}
        specialties={options.specialties}
        levelTags={options.levelTags}
        city={city}
        specialty={specialty}
        levelTag={levelTag}
        onCityChange={setCity}
        onSpecialtyChange={setSpecialty}
        onLevelTagChange={setLevelTag}
        onClear={() => {
          setCity("all");
          setSpecialty("all");
          setLevelTag("all");
        }}
        resultCount={filtered.length}
        totalCount={coaches.length}
      />

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 px-6 py-12 text-center text-sm text-[#8B735C] shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md">
          目前沒有符合條件的教練。
        </div>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <CoachCard key={c.id} coach={c} />
          ))}
        </div>
      )}
    </div>
  );
}

