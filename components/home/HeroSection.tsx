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
      className="relative isolate min-h-[80vh] overflow-hidden rounded-3xl border border-[rgba(255,255,255,0.10)] bg-gradient-to-br from-[#241816]/92 via-[#140f0d]/96 to-[#0b0706] px-6 py-14 shadow-[0_0_60px_rgba(31,20,16,0.22)] backdrop-blur-md md:px-10 md:py-16"
      aria-labelledby="hero-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-brand-blue/18 blur-[100px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-brand-red/18 blur-[110px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-px w-[120%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[rgba(205,162,116,0.45)] to-transparent"
      />

      <div className="relative grid gap-12 lg:grid-cols-2 lg:items-start">
        <div className="space-y-6">
          <p className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.12)] bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-brand-neon-purple/95 shadow-[0_0_24px_rgba(205,162,116,0.22)]">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-purple shadow-[0_0_10px_rgba(205,162,116,0.70)]" />
            {badge}
          </p>

          <h1
            id="hero-heading"
            className="text-balance text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl lg:text-[2.65rem]"
          >
            {title}
          </h1>
          <p className="max-w-xl text-pretty text-base leading-relaxed text-white/70 md:text-lg">
            {subtitle}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              href="/sessions?type=dropin"
              className="inline-flex items-center justify-center rounded-xl bg-brand-purple px-6 py-3 text-sm font-semibold text-[#140f0d] shadow-[0_0_32px_rgba(205,162,116,0.35)] transition hover:bg-[#e7c79c] hover:shadow-[0_0_48px_rgba(205,162,116,0.50)]"
            >
              查看臨打場次
            </Link>
            <Link
              href="/sessions?type=teaching"
              className="inline-flex items-center justify-center rounded-xl border border-[rgba(255,255,255,0.12)] bg-white/5 px-6 py-3 text-sm font-semibold text-white/90 backdrop-blur transition hover:border-[#cda274]/50 hover:bg-white/10"
            >
              預約羽球教學
            </Link>
            <Link
              href="/line-binding"
              className="inline-flex items-center justify-center text-sm font-medium text-brand-neon-purple/90 underline-offset-4 hover:underline"
            >
              LINE 綁定
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { label: "教學", tone: "border-[rgba(205,162,116,0.45)] bg-brand-purple/15 text-[#f8f3ea]" },
              { label: "臨打", tone: "border-[rgba(139,191,159,0.55)] bg-[rgba(139,191,159,0.12)] text-[#f8f3ea]" },
              { label: "據點資訊", tone: "border-[rgba(255,255,255,0.12)] bg-white/5 text-[#f8f3ea]" },
              { label: "後台可控", tone: "border-[rgba(255,255,255,0.12)] bg-white/5 text-[#f8f3ea]" },
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
          <div className="rounded-[2rem] border border-[rgba(255,255,255,0.10)] bg-[rgba(20,15,13,0.55)] shadow-[0_0_70px_rgba(0,0,0,0.34)] backdrop-blur-md">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-[2rem]"
              style={{
                background:
                  "radial-gradient(circle at 35% 25%, rgba(205,162,116,0.22), transparent 55%)",
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
              <div className="rounded-3xl border border-[rgba(255,255,255,0.10)] bg-white/[0.06] p-6 shadow-[0_0_40px_rgba(205,162,116,0.18)] backdrop-blur-md">
                <p className="text-sm text-white/70">
                  目前尚未開放據點，請稍後再回來查看。
                </p>
                <p className="mt-2 text-[11px] text-white/40">
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
