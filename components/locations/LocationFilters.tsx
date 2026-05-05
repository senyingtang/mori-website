"use client";

type Props = {
  cities: string[];
  city: string;
  onCityChange: (v: string) => void;
  serviceType: "all" | "teaching" | "dropin" | "both";
  onServiceTypeChange: (v: "all" | "teaching" | "dropin" | "both") => void;
};

export function LocationFilters({
  cities,
  city,
  onCityChange,
  serviceType,
  onServiceTypeChange,
}: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-md">
      <div className="grid gap-4 md:grid-cols-2">
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
          <label className="block text-xs font-medium text-white/55">
            服務類型
          </label>
          <select
            value={serviceType}
            onChange={(e) =>
              onServiceTypeChange(
                e.target.value === "teaching"
                  ? "teaching"
                  : e.target.value === "dropin"
                    ? "dropin"
                    : e.target.value === "both"
                      ? "both"
                      : "all"
              )
            }
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white"
          >
            <option value="all" className="bg-[#1a1028]">
              全部
            </option>
            <option value="teaching" className="bg-[#1a1028]">
              教學
            </option>
            <option value="dropin" className="bg-[#1a1028]">
              臨打
            </option>
            <option value="both" className="bg-[#1a1028]">
              兩者
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}

