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
    <article className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] shadow-[0_0_36px_rgba(168,85,247,0.14)] backdrop-blur-md transition hover:border-purple-400/35 hover:shadow-[0_0_48px_rgba(168,85,247,0.22)]">
      <div className="relative aspect-[4/3] bg-gradient-to-br from-brand-purple/25 via-brand-deep-purple/45 to-black/40">
        <SafeCoverImage
          src={coach.avatar_url}
          alt={coach.name}
          imgClassName="absolute inset-0 h-full w-full object-cover"
          fallback={
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-black/30 text-2xl font-semibold text-white/70">
                {pickInitial(coach.name)}
              </div>
            </div>
          }
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-white">{coach.name}</h2>
            <p className="mt-1 text-sm text-white/55">
              {city ?? "—"}
              {coach.experience_years != null ? ` · ${coach.experience_years} 年資` : ""}
            </p>
          </div>
          {coach.is_featured ? (
            <span className="shrink-0 rounded-full border border-purple-400/30 bg-brand-purple/15 px-2.5 py-0.5 text-[11px] font-semibold text-brand-neon-purple/95">
              Featured
            </span>
          ) : null}
        </div>

        <div className="mt-4 space-y-2">
          {(coach.specialties ?? []).length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {(coach.specialties ?? []).slice(0, 6).map((t) => (
                <span
                  key={t}
                  className="rounded-md bg-brand-blue/15 px-2 py-0.5 text-[11px] text-sky-100/90 ring-1 ring-sky-400/25"
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
                  className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-white/65 ring-1 ring-white/10"
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
                  className="rounded-md bg-rose-500/10 px-2 py-0.5 text-[11px] text-rose-100/85 ring-1 ring-rose-400/20"
                >
                  {t}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        {coach.description ? (
          <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-white/60">
            {coach.description}
          </p>
        ) : null}

        <div className="mt-6 flex items-center justify-between gap-3">
          <a
            href={consultHref}
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-brand-purple to-brand-neon-purple px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(168,85,247,0.35)] transition hover:brightness-110"
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
            className="text-sm font-medium text-brand-neon-purple/90 underline-offset-4 hover:underline"
          >
            查看場次
          </Link>
        </div>
      </div>
    </article>
  );
}

