import Link from "next/link";
import type { HomeSectionRow } from "@/lib/cms/types";
import type { Location, SessionWithLocation } from "@/types/cms";

type Props = {
  section: HomeSectionRow;
  locations: Location[];
  sessions: SessionWithLocation[];
};

function serviceLabel(t: Location["service_type"]): string {
  if (t === "teaching") return "教學";
  if (t === "dropin") return "臨打";
  return "教學 / 臨打";
}

function formatSessionMeta(s: SessionWithLocation): string {
  const parts: string[] = [];
  if (s.weekday) parts.push(s.weekday);
  if (s.start_time && s.end_time) {
    parts.push(`${s.start_time.slice(0, 5)}–${s.end_time.slice(0, 5)}`);
  }
  if (s.level_min != null && s.level_max == null) {
    parts.push(`${s.level_min}+ 級`);
  }
  if (s.level_min == null && s.level_max != null) {
    parts.push(`≤ ${s.level_max} 級`);
  }
  if (s.level_min != null && s.level_max != null) {
    parts.push(`${s.level_min}–${s.level_max} 級`);
  }
  if (s.shuttlecock) parts.push(`用球：${s.shuttlecock}`);
  if (s.price != null && s.price !== "") {
    parts.push(`費用：NT$ ${s.price}`);
  }
  if (s.capacity != null) {
    parts.push(`上限：${s.capacity}`);
  }
  return parts.join(" · ");
}

export function PopularVenues({
  section,
  locations,
  sessions,
}: Props) {
  void section;
  const locList = locations.slice(0, 6);
  const sessionsByLoc = new Map<string, SessionWithLocation[]>();
  for (const s of sessions) {
    const arr = sessionsByLoc.get(s.location_id) ?? [];
    arr.push(s);
    sessionsByLoc.set(s.location_id, arr);
  }

  return (
    <section
      id="popular-venues"
      className="scroll-mt-24 py-14 md:py-16"
    >
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#3A2A1E] md:text-3xl">
            熱門開團場地
          </h2>
          <p className="mt-2 text-sm text-[#6F5A46]">
            據點與場次來自 Supabase；無場次時仍顯示場地資訊。
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {locList.length === 0 ? (
          <p className="col-span-full rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 px-6 py-10 text-center text-sm text-[#8B735C]">
            尚無據點資料。請於後台新增 locations／sessions，或確認 Supabase 連線。
          </p>
        ) : (
          locList.map((loc) => {
            const locSessions = sessionsByLoc.get(loc.id) ?? [];
            const primary = locSessions[0];
            const meta = primary ? formatSessionMeta(primary) : null;

            return (
              <article
                key={loc.id}
                className="flex flex-col rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.72)] p-6 shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md transition hover:border-[rgba(185,133,82,0.35)] hover:shadow-[0_26px_72px_rgba(90,62,43,0.14)]"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-semibold text-[#3A2A1E]">{loc.name}</h3>
                  <span className="shrink-0 rounded-full border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 px-2.5 py-0.5 text-[11px] font-semibold text-[#6F5A46]">
                    {serviceLabel(loc.service_type)}
                  </span>
                </div>
                <p className="mt-2 text-sm text-[#6F5A46]">
                  {loc.city}
                  {loc.district ? ` · ${loc.district}` : ""}
                </p>
                {meta ? (
                  <p className="mt-4 text-sm leading-relaxed text-[#6F5A46]">
                    {meta}
                  </p>
                ) : (
                  <p className="mt-4 text-sm text-[#8B735C]">
                    {loc.description ?? "開團時間請見公告或聯絡我們。"}
                  </p>
                )}

                <div className="mt-6 flex items-center justify-between gap-3">
                  <Link
                    href={`/sessions?location=${encodeURIComponent(loc.id)}`}
                    className="inline-flex items-center justify-center rounded-xl bg-[#5A3E2B] px-4 py-2 text-sm font-semibold text-[#FFF8ED] shadow-[0_14px_34px_rgba(90,62,43,0.14)] transition hover:bg-[#B98552]"
                  >
                    查看場次
                  </Link>
                  <Link
                    href="/contact"
                    className="text-sm font-semibold text-[#5A3E2B] underline-offset-4 hover:underline"
                  >
                    聯絡我們
                  </Link>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
