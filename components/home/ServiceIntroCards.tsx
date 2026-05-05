import Link from "next/link";
import type { HomeSectionRow } from "@/lib/cms/types";
import { asRecord, getString } from "@/lib/cms/home-content";

type Props = {
  section: HomeSectionRow;
};

export function ServiceIntroCards({ section }: Props) {
  const raw = asRecord(section.content as unknown);
  const teaching = asRecord(raw?.["teaching"]);
  const dropin = asRecord(raw?.["dropin"]);

  const teachingTitle =
    getString(teaching, "title") ?? "羽球教學";
  const teachingDesc =
    getString(teaching, "description") ??
    "適合新手、初階、中階球友。從握拍、步伐、發球、殺球到雙打輪轉，建立完整羽球基礎。";
  const teachingCta =
    getString(teaching, "cta") ?? "查看教學據點";

  const dropinTitle =
    getString(dropin, "title") ?? "羽球臨打";
  const dropinDesc =
    getString(dropin, "description") ??
    "固定開團、程度限制、候補通知。透過 LINE 系統快速報名，不再依賴傳統文字接龍。";
  const dropinCta =
    getString(dropin, "cta") ?? "查看臨打場次";

  return (
    <section className="scroll-mt-24 py-12 md:py-16">
      <div className="grid gap-6 md:grid-cols-2">
        <article
          id="teaching"
          className="relative overflow-hidden rounded-3xl border border-sky-400/25 bg-gradient-to-br from-brand-blue/20 via-white/[0.04] to-transparent p-8 shadow-[0_0_50px_rgba(37,99,235,0.18)] backdrop-blur-md"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-blue/30 blur-3xl"
          />
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-200/90">
            Teaching
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">{teachingTitle}</h2>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            {teachingDesc}
          </p>
          <Link
            href="/sessions?type=teaching"
            className="mt-6 inline-flex rounded-xl bg-white/10 px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/15"
          >
            {teachingCta}
          </Link>
        </article>

        <article
          id="dropin"
          className="relative overflow-hidden rounded-3xl border border-rose-400/25 bg-gradient-to-br from-brand-red/20 via-white/[0.04] to-transparent p-8 shadow-[0_0_50px_rgba(239,68,68,0.15)] backdrop-blur-md"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-red/25 blur-3xl"
          />
          <p className="text-xs font-semibold uppercase tracking-wider text-rose-200/90">
            Drop-in
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">{dropinTitle}</h2>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            {dropinDesc}
          </p>
          <Link
            href="/sessions?type=dropin"
            className="mt-6 inline-flex rounded-xl bg-white/10 px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/15"
          >
            {dropinCta}
          </Link>
        </article>
      </div>
    </section>
  );
}
