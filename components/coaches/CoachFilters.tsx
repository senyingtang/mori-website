"use client";

type Props = {
  cities: string[];
  specialties: string[];
  levelTags: string[];
  city: string;
  specialty: string;
  levelTag: string;
  onCityChange: (v: string) => void;
  onSpecialtyChange: (v: string) => void;
  onLevelTagChange: (v: string) => void;
  onClear: () => void;
  resultCount: number;
  totalCount: number;
};

export function CoachFilters({
  cities,
  specialties,
  levelTags,
  city,
  specialty,
  levelTag,
  onCityChange,
  onSpecialtyChange,
  onLevelTagChange,
  onClear,
  resultCount,
  totalCount,
}: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-md">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-white/60">
          顯示 {resultCount} / {totalCount}
        </p>
        <button
          type="button"
          onClick={onClear}
          className="self-start rounded-xl border border-white/12 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10 md:self-auto"
        >
          清除篩選
        </button>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div>
          <label className="block text-xs font-medium text-white/55">地區</label>
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
          <label className="block text-xs font-medium text-white/55">專長</label>
          <select
            value={specialty}
            onChange={(e) => onSpecialtyChange(e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white"
          >
            {specialties.map((s) => (
              <option key={s} value={s} className="bg-[#1a1028]">
                {s === "all" ? "全部" : s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-white/55">程度</label>
          <select
            value={levelTag}
            onChange={(e) => onLevelTagChange(e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white"
          >
            {levelTags.map((t) => (
              <option key={t} value={t} className="bg-[#1a1028]">
                {t === "all" ? "全部" : t}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

