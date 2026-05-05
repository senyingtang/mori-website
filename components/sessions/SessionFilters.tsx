"use client";

import type { SessionTypeDb } from "@/types/cms";

type Props = {
  cities: string[];
  city: string;
  onCityChange: (v: string) => void;
  type: "all" | SessionTypeDb;
  onTypeChange: (v: "all" | SessionTypeDb) => void;
  weekdays: string[];
  weekday: string;
  onWeekdayChange: (v: string) => void;
};

export function SessionFilters({
  cities,
  city,
  onCityChange,
  type,
  onTypeChange,
  weekdays,
  weekday,
  onWeekdayChange,
}: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-md">
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="block text-xs font-medium text-white/55">縣市</label>
          <select
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white"
          >
            {cities.map((c) => (
              <option key={c} value={c} className="bg-[#1a1028]">
                {c === "all" ? "全部" : c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-white/55">類型</label>
          <select
            value={type}
            onChange={(e) =>
              onTypeChange(
                e.target.value === "teaching"
                  ? "teaching"
                  : e.target.value === "training"
                    ? "training"
                    : e.target.value === "dropin"
                      ? "dropin"
                      : "all"
              )
            }
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white"
          >
            <option value="all" className="bg-[#1a1028]">
              全部
            </option>
            <option value="dropin" className="bg-[#1a1028]">
              臨打
            </option>
            <option value="teaching" className="bg-[#1a1028]">
              教學
            </option>
            <option value="training" className="bg-[#1a1028]">
              訓練
            </option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-white/55">星期</label>
          <select
            value={weekday}
            onChange={(e) => onWeekdayChange(e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white"
          >
            {weekdays.map((w) => (
              <option key={w} value={w} className="bg-[#1a1028]">
                {w === "all" ? "全部" : w}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

