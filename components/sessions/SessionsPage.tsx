"use client";

import { useMemo, useState } from "react";
import type { SessionWithLocation, SessionTypeDb } from "@/types/cms";
import { PageHero } from "@/components/layout/PageHero";
import { SessionFilters } from "@/components/sessions/SessionFilters";
import { SessionCard } from "@/components/sessions/SessionCard";

type Props = {
  sessions: SessionWithLocation[];
  initialFilters: {
    location: string;
    city: string;
    type: string;
    weekday: string;
  };
};

export function SessionsPage({ sessions, initialFilters }: Props) {
  const [city, setCity] = useState<string>(initialFilters.city || "all");
  const [type, setType] = useState<"all" | SessionTypeDb>(
    (initialFilters.type as SessionTypeDb) || "all"
  );
  const [weekday, setWeekday] = useState<string>(initialFilters.weekday || "all");

  const cities = useMemo(() => {
    const set = new Set<string>();
    for (const s of sessions) {
      const c = s.location?.city;
      if (c) set.add(c);
    }
    return ["all", ...Array.from(set).sort((a, b) => a.localeCompare(b, "zh-Hant"))];
  }, [sessions]);

  const weekdays = useMemo(() => {
    const set = new Set<string>();
    for (const s of sessions) {
      if (s.weekday) set.add(s.weekday);
    }
    return ["all", ...Array.from(set).sort((a, b) => a.localeCompare(b, "zh-Hant"))];
  }, [sessions]);

  const filtered = useMemo(() => {
    return sessions.filter((s) => {
      if (city !== "all" && (s.location?.city ?? null) !== city) return false;
      if (type !== "all" && s.session_type !== type) return false;
      if (weekday !== "all" && (s.weekday ?? null) !== weekday) return false;
      return true;
    });
  }, [sessions, city, type, weekday]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 md:py-12">
      <PageHero
        title="場次總覽"
        subtitle="目前僅提供場次資訊彙整與基本篩選；尚未提供線上報名，請先點選「聯絡報名」。"
      />

      <SessionFilters
        cities={cities}
        city={city}
        onCityChange={setCity}
        type={type}
        onTypeChange={setType}
        weekdays={weekdays}
        weekday={weekday}
        onWeekdayChange={setWeekday}
      />

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.05] px-6 py-12 text-center text-sm text-white/55 backdrop-blur-md">
          目前沒有符合條件的場次資料。
        </div>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {filtered.map((s) => (
            <SessionCard key={s.id} session={s} />
          ))}
        </div>
      )}
    </div>
  );
}

