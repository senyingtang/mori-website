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
    <div className="rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 p-5 shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-[#6F5A46]">
          顯示 {resultCount} / {totalCount}
        </p>
        <button
          type="button"
          onClick={onClear}
          className="self-start rounded-xl bg-[#5A3E2B] px-4 py-2 text-sm font-semibold text-[#FFF8ED] shadow-[0_14px_34px_rgba(90,62,43,0.14)] transition hover:bg-[#B98552] md:self-auto"
        >
          清除篩選
        </button>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div>
          <label className="block text-xs font-semibold text-[#8B735C]">地區</label>
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
          <label className="block text-xs font-semibold text-[#8B735C]">專長</label>
          <select
            value={specialty}
            onChange={(e) => onSpecialtyChange(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.72)] px-4 py-2.5 text-sm text-[#3A2A1E] focus:border-[rgba(185,133,82,0.35)] focus:outline-none focus:ring-1 focus:ring-[rgba(185,133,82,0.22)]"
          >
            {specialties.map((s) => (
              <option key={s} value={s} className="bg-[#FFF8ED]">
                {s === "all" ? "全部" : s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#8B735C]">程度</label>
          <select
            value={levelTag}
            onChange={(e) => onLevelTagChange(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.72)] px-4 py-2.5 text-sm text-[#3A2A1E] focus:border-[rgba(185,133,82,0.35)] focus:outline-none focus:ring-1 focus:ring-[rgba(185,133,82,0.22)]"
          >
            {levelTags.map((t) => (
              <option key={t} value={t} className="bg-[#FFF8ED]">
                {t === "all" ? "全部" : t}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

