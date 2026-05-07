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
    <div className="rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 p-5 shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md">
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="block text-xs font-semibold text-[#8B735C]">縣市</label>
          <select
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.72)] px-4 py-2.5 text-sm text-[#3A2A1E] focus:border-[rgba(185,133,82,0.35)] focus:outline-none focus:ring-1 focus:ring-[rgba(185,133,82,0.22)]"
          >
            {cities.map((c) => (
              <option key={c} value={c} className="bg-[#FFF8ED]">
                {c === "all" ? "全部" : c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#8B735C]">類型</label>
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
            className="mt-1 w-full rounded-xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.72)] px-4 py-2.5 text-sm text-[#3A2A1E] focus:border-[rgba(185,133,82,0.35)] focus:outline-none focus:ring-1 focus:ring-[rgba(185,133,82,0.22)]"
          >
            <option value="all" className="bg-[#FFF8ED]">
              全部
            </option>
            <option value="dropin" className="bg-[#FFF8ED]">
              臨打
            </option>
            <option value="teaching" className="bg-[#FFF8ED]">
              教學
            </option>
            <option value="training" className="bg-[#FFF8ED]">
              訓練
            </option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#8B735C]">星期</label>
          <select
            value={weekday}
            onChange={(e) => onWeekdayChange(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.72)] px-4 py-2.5 text-sm text-[#3A2A1E] focus:border-[rgba(185,133,82,0.35)] focus:outline-none focus:ring-1 focus:ring-[rgba(185,133,82,0.22)]"
          >
            {weekdays.map((w) => (
              <option key={w} value={w} className="bg-[#FFF8ED]">
                {w === "all" ? "全部" : w}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

