"use client";

import Link from "next/link";
import type { SessionWithLocation } from "@/types/cms";

function typeLabel(t: SessionWithLocation["session_type"]): string {
  if (t === "dropin") return "臨打";
  if (t === "training") return "訓練";
  return "教學";
}

function timeLabel(s: SessionWithLocation): string {
  if (s.start_time && s.end_time) return `${s.start_time.slice(0, 5)}–${s.end_time.slice(0, 5)}`;
  return "—";
}

function levelLabel(s: SessionWithLocation): string | null {
  if (s.level_min != null && s.level_max != null) return `${s.level_min}–${s.level_max} 級`;
  if (s.level_min != null && s.level_max == null) return `${s.level_min}+ 級`;
  if (s.level_min == null && s.level_max != null) return `≤ ${s.level_max} 級`;
  return null;
}

export function SessionCard({ session }: { session: SessionWithLocation }) {
  const loc = session.location;
  const level = levelLabel(session);
  const price =
    session.price != null && session.price !== "" ? `NT$ ${session.price}` : "請洽詢";
  const contactType = session.session_type === "teaching" ? "teaching" : "dropin";

  return (
    <article className="rounded-2xl border border-[rgba(255,255,255,0.10)] bg-white/[0.06] p-6 shadow-[0_0_40px_rgba(31,20,16,0.12)] backdrop-blur-md transition hover:border-[rgba(205,162,116,0.45)] hover:shadow-[0_0_48px_rgba(205,162,116,0.18)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-white">
            {session.title?.trim() ? session.title : "羽球場次"}
          </h2>
          <p className="mt-2 text-sm text-white/55">
            {loc ? (
              <>
                {loc.name} · {loc.city}
                {loc.district ? ` · ${loc.district}` : ""}
              </>
            ) : (
              "（場地資訊即將更新）"
            )}
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-medium text-white/70">
          {typeLabel(session.session_type)}
        </span>
      </div>

      <div className="mt-4 grid gap-2 text-sm text-white/70">
        <p>
          <span className="text-white/45">星期</span>：{session.weekday ?? "—"}
        </p>
        <p>
          <span className="text-white/45">時間</span>：{timeLabel(session)}
        </p>
        {level ? (
          <p>
            <span className="text-white/45">程度限制</span>：{level}
          </p>
        ) : null}
        {session.shuttlecock ? (
          <p>
            <span className="text-white/45">用球</span>：{session.shuttlecock}
          </p>
        ) : null}
        <p>
          <span className="text-white/45">費用</span>：{price}
        </p>
        {session.capacity != null ? (
          <p>
            <span className="text-white/45">人數上限</span>：{session.capacity}
          </p>
        ) : null}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <Link
          href={`/contact?type=${contactType}&source_type=session&source_id=${encodeURIComponent(
            session.id
          )}`}
          className="inline-flex items-center justify-center rounded-xl bg-brand-purple px-5 py-2.5 text-sm font-semibold text-[#140f0d] shadow-[0_0_24px_rgba(205,162,116,0.30)] transition hover:bg-[#e7c79c]"
        >
          聯絡報名
        </Link>
        {loc ? (
          <Link
            href={`/locations?city=${encodeURIComponent(loc.city)}`}
            className="text-sm font-medium text-brand-neon-purple/90 underline-offset-4 hover:underline"
          >
            查看附近據點
          </Link>
        ) : null}
      </div>
    </article>
  );
}

