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
    <article className="rounded-2xl border border-[rgba(90,62,43,0.12)] bg-[rgba(255,248,237,0.72)] p-6 shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md transition hover:border-[rgba(185,133,82,0.35)] hover:shadow-[0_26px_72px_rgba(90,62,43,0.14)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-[#3A2A1E]">{location.name}</h2>
          <p className="mt-2 text-sm text-[#6F5A46]">
            {location.city}
            {location.district ? ` · ${location.district}` : ""}
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.66)] px-2.5 py-0.5 text-[11px] font-semibold text-[#6F5A46]">
          {serviceLabel(location.service_type)}
        </span>
      </div>

      {location.address ? (
        <p className="mt-3 text-sm text-[#6F5A46]">{location.address}</p>
      ) : null}

      {location.description ? (
        <p className="mt-3 text-sm leading-relaxed text-[#6F5A46]">
          {location.description}
        </p>
      ) : null}

      <div className="mt-4 rounded-xl border border-[rgba(90,62,43,0.12)] bg-[rgba(255,248,237,0.66)] px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#8B735C]">
          場次摘要
        </p>
        {list.length === 0 ? (
          <p className="mt-2 text-sm text-[#6F5A46]">場次資訊即將更新。</p>
        ) : (
          <ul className="mt-2 space-y-1">
            {list.map((s) => (
              <li key={s.id} className="text-sm text-[#3A2A1E]">
                {formatSessionLine(s)}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <Link
          href={`/sessions?location=${encodeURIComponent(location.id)}`}
          className="inline-flex items-center justify-center rounded-xl bg-[#5A3E2B] px-5 py-2.5 text-sm font-semibold text-[#FFF8ED] shadow-[0_16px_42px_rgba(90,62,43,0.18)] transition hover:bg-[#B98552]"
        >
          查看場次
        </Link>
        <Link
          href={`/contact?source_type=location&source_id=${encodeURIComponent(location.id)}`}
          className="text-sm font-semibold text-[#5A3E2B] underline-offset-4 hover:underline"
        >
          聯絡我們
        </Link>
      </div>
    </article>
  );
}

