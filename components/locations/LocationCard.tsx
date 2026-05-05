"use client";

import Link from "next/link";
import type { Location, Session } from "@/types/cms";

function serviceLabel(t: Location["service_type"]): string {
  if (t === "teaching") return "教學";
  if (t === "dropin") return "臨打";
  return "教學 / 臨打";
}

function formatSessionLine(s: Session): string {
  const parts: string[] = [];
  parts.push(s.session_type === "dropin" ? "臨打" : s.session_type === "training" ? "訓練" : "教學");
  if (s.weekday) parts.push(s.weekday);
  if (s.start_time && s.end_time) parts.push(`${s.start_time.slice(0, 5)}–${s.end_time.slice(0, 5)}`);
  if (s.level_min != null && s.level_max != null) parts.push(`${s.level_min}–${s.level_max} 級`);
  if (s.shuttlecock) parts.push(`用球：${s.shuttlecock}`);
  if (s.price != null && s.price !== "") parts.push(`NT$ ${s.price}`);
  if (s.capacity != null) parts.push(`上限 ${s.capacity}`);
  return parts.join(" · ");
}

export function LocationCard({
  location,
  sessions,
}: {
  location: Location;
  sessions: Session[];
}) {
  const list = sessions.slice(0, 3);

  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 shadow-[0_0_40px_rgba(168,85,247,0.12)] backdrop-blur-md transition hover:border-purple-400/35 hover:shadow-[0_0_48px_rgba(168,85,247,0.22)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-white">{location.name}</h2>
          <p className="mt-2 text-sm text-white/55">
            {location.city}
            {location.district ? ` · ${location.district}` : ""}
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-medium text-white/70">
          {serviceLabel(location.service_type)}
        </span>
      </div>

      {location.address ? (
        <p className="mt-3 text-sm text-white/65">{location.address}</p>
      ) : null}

      {location.description ? (
        <p className="mt-3 text-sm leading-relaxed text-white/55">
          {location.description}
        </p>
      ) : null}

      <div className="mt-4 rounded-xl border border-white/10 bg-black/20 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/45">
          場次摘要
        </p>
        {list.length === 0 ? (
          <p className="mt-2 text-sm text-white/50">場次資訊即將更新。</p>
        ) : (
          <ul className="mt-2 space-y-1">
            {list.map((s) => (
              <li key={s.id} className="text-sm text-white/75">
                {formatSessionLine(s)}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <Link
          href={`/sessions?location=${encodeURIComponent(location.id)}`}
          className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-brand-purple to-brand-neon-purple px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(168,85,247,0.35)] transition hover:brightness-110"
        >
          查看場次
        </Link>
        <Link
          href={`/contact?source_type=location&source_id=${encodeURIComponent(location.id)}`}
          className="text-sm font-medium text-brand-neon-purple/90 underline-offset-4 hover:underline"
        >
          聯絡我們
        </Link>
      </div>
    </article>
  );
}

