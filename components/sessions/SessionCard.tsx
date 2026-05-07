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
    <article className="rounded-2xl border border-[rgba(90,62,43,0.12)] bg-[rgba(255,248,237,0.72)] p-6 shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md transition hover:border-[rgba(185,133,82,0.35)] hover:shadow-[0_26px_72px_rgba(90,62,43,0.14)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-[#3A2A1E]">
            {session.title?.trim() ? session.title : "羽球場次"}
          </h2>
          <p className="mt-2 text-sm text-[#6F5A46]">
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
        <span className="shrink-0 rounded-full border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.66)] px-2.5 py-0.5 text-[11px] font-semibold text-[#6F5A46]">
          {typeLabel(session.session_type)}
        </span>
      </div>

      <div className="mt-4 grid gap-2 text-sm text-[#6F5A46]">
        <p>
          <span className="text-[#8B735C]">星期</span>：{session.weekday ?? "—"}
        </p>
        <p>
          <span className="text-[#8B735C]">時間</span>：{timeLabel(session)}
        </p>
        {level ? (
          <p>
            <span className="text-[#8B735C]">程度限制</span>：{level}
          </p>
        ) : null}
        {session.shuttlecock ? (
          <p>
            <span className="text-[#8B735C]">用球</span>：{session.shuttlecock}
          </p>
        ) : null}
        <p>
          <span className="text-[#8B735C]">費用</span>：{price}
        </p>
        {session.capacity != null ? (
          <p>
            <span className="text-[#8B735C]">人數上限</span>：{session.capacity}
          </p>
        ) : null}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <Link
          href={`/contact?type=${contactType}&source_type=session&source_id=${encodeURIComponent(
            session.id
          )}`}
          className="inline-flex items-center justify-center rounded-xl bg-[#5A3E2B] px-5 py-2.5 text-sm font-semibold text-[#FFF8ED] shadow-[0_16px_42px_rgba(90,62,43,0.18)] transition hover:bg-[#B98552]"
        >
          聯絡報名
        </Link>
        {loc ? (
          <Link
            href={`/locations?city=${encodeURIComponent(loc.city)}`}
            className="text-sm font-semibold text-[#5A3E2B] underline-offset-4 hover:underline"
          >
            查看附近據點
          </Link>
        ) : null}
      </div>
    </article>
  );
}

