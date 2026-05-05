import Link from "next/link";
import type { Location, MapCitySetting, MapTabType, Session } from "@/types/cms";

type Props = {
  citySetting: MapCitySetting;
  locations: Location[];
  sessions: Session[];
};

function tabLabel(tab: MapTabType): string {
  return tab === "teaching" ? "教學" : "臨打";
}

function serviceLabel(t: Location["service_type"]): string {
  if (t === "teaching") return "教學";
  if (t === "dropin") return "臨打";
  return "教學 / 臨打";
}

export function LocationHoverCard({ citySetting, locations, sessions }: Props) {
  const list = locations.filter((l) => citySetting.location_ids.includes(l.id));
  const sessionsByLoc = new Map<string, Session[]>();
  for (const s of sessions) {
    const arr = sessionsByLoc.get(s.location_id) ?? [];
    arr.push(s);
    sessionsByLoc.set(s.location_id, arr);
  }

  return (
    <div className="w-full rounded-2xl border border-[rgba(255,255,255,0.10)] bg-white/[0.06] p-5 shadow-[0_0_40px_rgba(31,20,16,0.14)] backdrop-blur-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/45">
            {tabLabel(citySetting.tab_type)} · {citySetting.city}
          </p>
          <h3 className="mt-1 text-base font-semibold text-white">
            {citySetting.hover_title}
          </h3>
          {citySetting.hover_description ? (
            <p className="mt-2 text-sm text-white/65">
              {citySetting.hover_description}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {list.length === 0 ? (
          <p className="text-sm text-white/50">詳細場地資訊即將更新。</p>
        ) : (
          list.slice(0, 5).map((l) => (
            <div
              key={l.id}
              className="rounded-xl border border-white/10 bg-black/20 px-4 py-3"
            >
              <p className="text-sm font-semibold text-white">{l.name}</p>
              <p className="mt-1 text-xs text-white/50">
                {l.city}
                {l.district ? ` · ${l.district}` : ""} · {serviceLabel(l.service_type)}
              </p>
              {l.address ? (
                <p className="mt-1 text-xs text-white/45">{l.address}</p>
              ) : null}

              <div className="mt-3 space-y-1">
                {(sessionsByLoc.get(l.id) ?? []).length === 0 ? (
                  <p className="text-xs text-white/40">場次資訊即將更新。</p>
                ) : (
                  (sessionsByLoc.get(l.id) ?? []).slice(0, 2).map((s) => (
                    <p key={s.id} className="text-xs text-white/70">
                      {s.session_type === "dropin" ? (
                        <>
                          {s.weekday ?? "—"}
                          {s.start_time && s.end_time
                            ? ` ${s.start_time.slice(0, 5)}–${s.end_time.slice(0, 5)}`
                            : ""}
                          {s.level_min != null && s.level_max != null
                            ? ` · ${s.level_min}–${s.level_max} 級`
                            : ""}
                          {s.shuttlecock ? ` · 用球：${s.shuttlecock}` : ""}
                          {s.price != null && s.price !== ""
                            ? ` · 費用：NT$ ${s.price}`
                            : ""}
                          {s.capacity != null ? ` · 上限：${s.capacity}` : ""}
                        </>
                      ) : (
                        <>
                          {s.weekday ?? "—"}
                          {s.start_time && s.end_time
                            ? ` ${s.start_time.slice(0, 5)}–${s.end_time.slice(0, 5)}`
                            : ""}
                          {s.session_type ? ` · ${s.session_type}` : ""}
                          {s.price != null && s.price !== ""
                            ? ` · 費用：NT$ ${s.price}`
                            : " · 費用：請洽詢"}
                        </>
                      )}
                    </p>
                  ))
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-5 flex items-center justify-end">
        {(() => {
          const dbHref = citySetting.cta_href?.trim();
          const href =
            dbHref && dbHref !== ""
              ? dbHref
              : citySetting.tab_type === "teaching"
                ? `/sessions?type=teaching&city=${encodeURIComponent(citySetting.city)}`
                : `/sessions?type=dropin&city=${encodeURIComponent(citySetting.city)}`;
          return (
        <Link
          href={href}
          className="inline-flex items-center justify-center rounded-xl bg-brand-purple px-5 py-2.5 text-sm font-semibold text-[#140f0d] shadow-[0_0_24px_rgba(205,162,116,0.30)] transition hover:bg-[#e7c79c]"
        >
          {citySetting.cta_text}
        </Link>
          );
        })()}
      </div>
    </div>
  );
}

