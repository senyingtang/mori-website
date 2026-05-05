import Link from "next/link";
import type { HomeSectionRow } from "@/lib/cms/types";
import { asRecord, getString } from "@/lib/cms/home-content";

const DEFAULT_TITLE = "告別文字接龍，用 LINE 完成報名與候補通知";
const DEFAULT_BODY =
  "球友可透過 LINE 快速查看場次、報名臨打、查詢候補狀態。當候補球員遞補為正式名單時，系統會自動通知，降低團主人工管理成本，也讓球友不再錯過上場機會。";

const FEATURES = [
  "場次查詢",
  "一鍵報名",
  "候補通知",
  "會員綁定",
  "未來訂單通知",
  "球友紀錄",
];

type Props = {
  section: HomeSectionRow;
};

export function LineSystemIntro({ section }: Props) {
  const content = asRecord(section.content as unknown);
  const title = getString(content, "title") ?? DEFAULT_TITLE;
  const body = getString(content, "body") ?? DEFAULT_BODY;

  return (
    <section className="relative scroll-mt-24 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#1a0f35]/90 via-[#0d071c]/95 to-[#06030f] py-14 md:py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-purple-500/20 blur-[90px]"
      />
      <div className="relative mx-auto max-w-3xl px-2 text-center md:px-6">
        <h2 className="text-2xl font-bold text-white md:text-3xl">{title}</h2>
        <p className="mt-4 text-sm leading-relaxed text-white/70 md:text-base">
          {body}
        </p>
      </div>
      <div className="relative mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
        {FEATURES.map((label) => (
          <div
            key={label}
            className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center text-sm font-medium text-white/85 shadow-[0_0_24px_rgba(168,85,247,0.12)] backdrop-blur-sm"
          >
            {label}
          </div>
        ))}
      </div>
      <div className="relative mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href="/line-binding"
          className="inline-flex min-w-[200px] items-center justify-center rounded-xl bg-gradient-to-r from-brand-purple to-brand-neon-purple px-6 py-3 text-sm font-semibold text-white shadow-[0_0_32px_rgba(168,85,247,0.4)] transition hover:brightness-110"
        >
          LINE 綁定
        </Link>
        <Link
          href="/contact"
          className="inline-flex min-w-[200px] items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white/90 backdrop-blur transition hover:border-white/25"
        >
          聯絡我們
        </Link>
      </div>
    </section>
  );
}
