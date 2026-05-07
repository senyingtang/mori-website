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
    <div className="rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 p-5 shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md">
      <div className="grid gap-4 md:grid-cols-2">
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
          <label className="block text-xs font-semibold text-[#8B735C]">
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
            className="mt-1 w-full rounded-xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.72)] px-4 py-2.5 text-sm text-[#3A2A1E] focus:border-[rgba(185,133,82,0.35)] focus:outline-none focus:ring-1 focus:ring-[rgba(185,133,82,0.22)]"
          >
            <option value="all" className="bg-[#FFF8ED]">
              全部
            </option>
            <option value="teaching" className="bg-[#FFF8ED]">
              教學
            </option>
            <option value="dropin" className="bg-[#FFF8ED]">
              臨打
            </option>
            <option value="both" className="bg-[#FFF8ED]">
              兩者
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}

