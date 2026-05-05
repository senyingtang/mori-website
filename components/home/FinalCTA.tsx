import Link from "next/link";
import type { HomeSectionRow } from "@/lib/cms/types";
import { asRecord, getString } from "@/lib/cms/home-content";

type Props = {
  section: HomeSectionRow;
};

const DEFAULT_TITLE = "準備好加入下一場羽球節奏了嗎？";

export function FinalCTA({ section }: Props) {
  const content = asRecord(section.content as unknown);
  const title = getString(content, "title") ?? DEFAULT_TITLE;

  return (
    <section className="relative scroll-mt-24 overflow-hidden rounded-3xl border border-[rgba(255,255,255,0.10)] bg-[radial-gradient(circle_at_top,_rgba(205,162,116,0.20),_transparent_45%),linear-gradient(135deg,_#140f0d_0%,_#241816_45%,_#33211d_100%)] px-6 py-14 shadow-[0_0_60px_rgba(31,20,16,0.20)] md:px-12 md:py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-40 w-[120%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[rgba(205,162,116,0.22)] to-transparent blur-3xl"
      />
      <div className="relative mx-auto max-w-3xl text-center">
        <h2 className="text-2xl font-bold text-white md:text-3xl">{title}</h2>
        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:justify-center">
          <a
            href="#dropin"
            className="inline-flex items-center justify-center rounded-xl bg-brand-purple px-8 py-3.5 text-sm font-semibold text-[#140f0d] shadow-[0_0_36px_rgba(205,162,116,0.35)] transition hover:bg-[#e7c79c]"
          >
            查看臨打場次
          </a>
          <Link
            href="/line-binding"
            className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white/95 backdrop-blur transition hover:bg-white/10"
          >
            加入 LINE 綁定會員
          </Link>
        </div>
      </div>
    </section>
  );
}
