"use client";

import Link from "next/link";
import { SafeCoverImage } from "@/components/common/SafeCoverImage";
import type { Coach } from "@/types/cms";

function pickInitial(name: string): string {
  const t = name.trim();
  return t ? t.slice(0, 1) : "C";
}

export function CoachCard({ coach }: { coach: Coach }) {
  const consultHref = coach.line_contact_url?.trim()
    ? coach.line_contact_url
    : `/contact?type=teaching&source_type=coach&source_id=${encodeURIComponent(
        coach.id
      )}`;
  const city = coach.city?.trim() ? coach.city : null;

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-[rgba(90,62,43,0.12)] bg-[rgba(255,248,237,0.72)] shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md transition hover:border-[rgba(185,133,82,0.35)] hover:shadow-[0_26px_72px_rgba(90,62,43,0.14)]">
      <div className="relative aspect-[4/3] bg-gradient-to-br from-[rgba(214,168,108,0.18)] via-[rgba(255,248,237,0.20)] to-transparent">
        <SafeCoverImage
          src={coach.avatar_url}
          alt={coach.name}
          imgClassName="absolute inset-0 h-full w-full object-cover"
          fallback={
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.86)] text-2xl font-semibold text-[#5A3E2B] shadow-[0_14px_34px_rgba(90,62,43,0.10)]">
                {pickInitial(coach.name)}
              </div>
            </div>
          }
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-[#3A2A1E]">{coach.name}</h2>
            <p className="mt-1 text-sm text-[#6F5A46]">
              {city ?? "—"}
              {coach.experience_years != null ? ` · ${coach.experience_years} 年資` : ""}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
            {coach.is_main_featured ? (
              <span className="rounded-full border border-[rgba(185,133,82,0.28)] bg-[rgba(214,168,108,0.22)] px-2.5 py-0.5 text-[11px] font-semibold text-[#5A3E2B]">
                主教練
              </span>
            ) : null}
            {coach.is_featured ? (
              <span className="rounded-full border border-[rgba(90,62,43,0.12)] bg-[rgba(255,248,237,0.66)] px-2.5 py-0.5 text-[11px] font-semibold text-[#6F5A46]">
                精選
              </span>
            ) : null}
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {(coach.specialties ?? []).length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {(coach.specialties ?? []).slice(0, 6).map((t) => (
                <span
                  key={t}
                  className="rounded-md bg-[rgba(111,163,123,0.16)] px-2 py-0.5 text-[11px] text-[#3A2A1E] ring-1 ring-[rgba(111,163,123,0.22)]"
                >
                  {t}
                </span>
              ))}
            </div>
          ) : null}

          {(coach.level_tags ?? []).length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {(coach.level_tags ?? []).slice(0, 6).map((t) => (
                <span
                  key={t}
                  className="rounded-md bg-[rgba(214,168,108,0.14)] px-2 py-0.5 text-[11px] text-[#6F5A46] ring-1 ring-[rgba(185,133,82,0.20)]"
                >
                  {t}
                </span>
              ))}
            </div>
          ) : null}

          {(coach.teaching_styles ?? []).length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {(coach.teaching_styles ?? []).slice(0, 6).map((t) => (
                <span
                  key={t}
                  className="rounded-md bg-[rgba(185,133,82,0.12)] px-2 py-0.5 text-[11px] text-[#5A3E2B] ring-1 ring-[rgba(185,133,82,0.22)]"
                >
                  {t}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        {coach.description ? (
          <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-[#6F5A46]">
            {coach.description}
          </p>
        ) : null}

        <div className="mt-6 flex items-center justify-between gap-3">
          <a
            href={consultHref}
            className="inline-flex items-center justify-center rounded-xl bg-[#5A3E2B] px-5 py-2.5 text-sm font-semibold text-[#FFF8ED] shadow-[0_16px_42px_rgba(90,62,43,0.18)] transition hover:bg-[#B98552]"
            target={consultHref.startsWith("http") ? "_blank" : undefined}
            rel={consultHref.startsWith("http") ? "noreferrer" : undefined}
          >
            預約／諮詢
          </a>
          <Link
            href={
              city
                ? `/sessions?type=teaching&city=${encodeURIComponent(city)}`
                : "/sessions?type=teaching"
            }
            className="text-sm font-semibold text-[#5A3E2B] underline-offset-4 hover:underline"
          >
            查看場次
          </Link>
        </div>
      </div>
    </article>
  );
}

