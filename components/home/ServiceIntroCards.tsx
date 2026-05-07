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
          className="relative overflow-hidden rounded-3xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.72)] p-8 shadow-[0_22px_66px_rgba(90,62,43,0.12)] backdrop-blur-md"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full blur-3xl"
            style={{ background: "rgba(111,163,123,0.18)" }}
          />
          <p className="text-xs font-semibold uppercase tracking-wider text-[#6FA37B]">
            Teaching
          </p>
          <h2 className="mt-2 text-2xl font-bold text-[#3A2A1E]">{teachingTitle}</h2>
          <p className="mt-4 text-sm leading-relaxed text-[#6F5A46]">
            {teachingDesc}
          </p>
          <Link
            href="/sessions?type=teaching"
            className="mt-6 inline-flex rounded-xl bg-[#5A3E2B] px-5 py-2.5 text-sm font-semibold text-[#FFF8ED] shadow-[0_16px_42px_rgba(90,62,43,0.18)] transition hover:bg-[#B98552]"
          >
            {teachingCta}
          </Link>
        </article>

        <article
          id="dropin"
          className="relative overflow-hidden rounded-3xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.72)] p-8 shadow-[0_22px_66px_rgba(90,62,43,0.12)] backdrop-blur-md"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full blur-3xl"
            style={{ background: "rgba(214,168,108,0.22)" }}
          />
          <p className="text-xs font-semibold uppercase tracking-wider text-[#B98552]">
            Drop-in
          </p>
          <h2 className="mt-2 text-2xl font-bold text-[#3A2A1E]">{dropinTitle}</h2>
          <p className="mt-4 text-sm leading-relaxed text-[#6F5A46]">
            {dropinDesc}
          </p>
          <Link
            href="/sessions?type=dropin"
            className="mt-6 inline-flex rounded-xl bg-[#5A3E2B] px-5 py-2.5 text-sm font-semibold text-[#FFF8ED] shadow-[0_16px_42px_rgba(90,62,43,0.18)] transition hover:bg-[#B98552]"
          >
            {dropinCta}
          </Link>
        </article>
      </div>
    </section>
  );
}
