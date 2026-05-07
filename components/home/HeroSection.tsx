import Link from "next/link";
import type { HomeSectionRow } from "@/lib/cms/types";
import type { SiteSettingsMap } from "@/lib/cms/types";
import { asRecord, getString } from "@/lib/cms/home-content";
import { getBrandFromSettings } from "@/lib/cms/brand";
import type { Location, MapCitySetting, Session } from "@/types/cms";
import { TaiwanServiceMap } from "@/components/home/TaiwanServiceMap";

type Props = {
  section: HomeSectionRow;
  siteSettings: SiteSettingsMap;
  mapCities: MapCitySetting[];
  mapLocations: Location[];
  mapSessions: Session[];
};

const DEFAULT_TITLE = "從教學到臨打，找到最適合你的羽球節奏";
const DEFAULT_SUBTITLE =
  "整合羽球教學、臨打開團與 LINE 報名通知，讓球友不用再翻群組接龍，也能快速找到適合自己的教練、場地與下一場比賽。";

export function HeroSection({
  section,
  siteSettings,
  mapCities,
  mapLocations,
  mapSessions,
}: Props) {
  const content = asRecord(section.content as unknown);
  const title = getString(content, "title") ?? DEFAULT_TITLE;
  const subtitle = getString(content, "subtitle") ?? DEFAULT_SUBTITLE;
  const { siteName } = getBrandFromSettings(siteSettings);
  const badge = getString(content, "badge") ?? siteName;

  return (
    <section
      className="relative isolate min-h-[76vh] overflow-hidden rounded-3xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.62)] px-6 py-14 shadow-[0_28px_80px_rgba(90,62,43,0.12)] backdrop-blur-md md:px-10 md:py-16"
      aria-labelledby="hero-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full blur-[110px]"
        style={{ background: "rgba(214,168,108,0.32)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full blur-[120px]"
        style={{ background: "rgba(111,163,123,0.20)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-px w-[120%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[rgba(185,133,82,0.45)] to-transparent"
      />

      <div className="relative grid gap-12 lg:grid-cols-2 lg:items-start">
        <div className="space-y-6">
          <p className="inline-flex items-center gap-2 rounded-full border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.72)] px-4 py-1.5 text-xs font-semibold tracking-wide text-[#5A3E2B] shadow-[0_16px_40px_rgba(90,62,43,0.10)]">
            <span className="h-1.5 w-1.5 rounded-full shadow-[0_0_10px_rgba(185,133,82,0.45)]" style={{ background: "#B98552" }} />
            {badge}
          </p>

          <h1
            id="hero-heading"
            className="text-balance text-3xl font-bold leading-tight tracking-tight text-[#3A2A1E] md:text-4xl lg:text-[2.65rem]"
          >
            {title}
          </h1>
          <p className="max-w-xl text-pretty text-base leading-relaxed text-[#6F5A46] md:text-lg">
            {subtitle}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              href="/sessions?type=dropin"
              className="inline-flex items-center justify-center rounded-xl bg-[#5A3E2B] px-6 py-3 text-sm font-semibold text-[#FFF8ED] shadow-[0_18px_46px_rgba(90,62,43,0.18)] transition hover:bg-[#B98552]"
            >
              查看臨打場次
            </Link>
            <Link
              href="/sessions?type=teaching"
              className="inline-flex items-center justify-center rounded-xl border border-[rgba(90,62,43,0.18)] bg-[rgba(255,248,237,0.66)] px-6 py-3 text-sm font-semibold text-[#5A3E2B] shadow-[0_14px_34px_rgba(90,62,43,0.08)] backdrop-blur transition hover:border-[rgba(185,133,82,0.35)] hover:bg-[rgba(255,248,237,0.86)]"
            >
              預約羽球教學
            </Link>
            <Link
              href="/line-binding"
              className="inline-flex items-center justify-center text-sm font-semibold text-[#5A3E2B] underline-offset-4 hover:underline"
            >
              LINE 綁定
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { label: "教學", tone: "border-[rgba(185,133,82,0.28)] bg-[rgba(214,168,108,0.22)] text-[#5A3E2B]" },
              { label: "臨打", tone: "border-[rgba(111,163,123,0.26)] bg-[rgba(111,163,123,0.16)] text-[#3A2A1E]" },
              { label: "據點資訊", tone: "border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.66)] text-[#5A3E2B]" },
              { label: "後台可控", tone: "border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.66)] text-[#5A3E2B]" },
            ].map((chip) => (
              <span
                key={chip.label}
                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${chip.tone}`}
              >
                {chip.label}
              </span>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="rounded-[2rem] border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.72)] shadow-[0_22px_66px_rgba(90,62,43,0.14)] backdrop-blur-md">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-[2rem]"
              style={{
                background:
                  "radial-gradient(circle at 35% 25%, rgba(214,168,108,0.32), transparent 58%)",
              }}
            />
            <div className="relative overflow-hidden rounded-[2rem] p-5 sm:p-6 lg:min-h-[620px]">
            {mapCities.length > 0 ? (
              <TaiwanServiceMap
                mapCities={mapCities}
                locations={mapLocations}
                sessions={mapSessions}
              />
            ) : (
              <div className="rounded-3xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.72)] p-6 shadow-[0_18px_52px_rgba(90,62,43,0.10)] backdrop-blur-md">
                <p className="text-sm text-[#6F5A46]">
                  目前尚未開放據點，請稍後再回來查看。
                </p>
                <p className="mt-2 text-[11px] text-[#8B735C]">
                  TaiwanServiceMap SVG MVP 需要 map_city_settings 資料。
                </p>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
