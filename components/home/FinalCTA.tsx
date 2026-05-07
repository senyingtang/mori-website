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
    <section className="relative scroll-mt-24 overflow-hidden rounded-3xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.72)] px-6 py-14 shadow-[0_28px_86px_rgba(90,62,43,0.12)] backdrop-blur-md md:px-12 md:py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-40 w-[120%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[rgba(214,168,108,0.28)] to-transparent blur-3xl"
      />
      <div className="relative mx-auto max-w-3xl text-center">
        <h2 className="text-2xl font-bold text-[#3A2A1E] md:text-3xl">{title}</h2>
        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:justify-center">
          <a
            href="#dropin"
            className="inline-flex items-center justify-center rounded-xl bg-[#5A3E2B] px-8 py-3.5 text-sm font-semibold text-[#FFF8ED] shadow-[0_16px_46px_rgba(90,62,43,0.18)] transition hover:bg-[#B98552]"
          >
            查看臨打場次
          </a>
          <Link
            href="/line-binding"
            className="inline-flex items-center justify-center rounded-xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 px-8 py-3.5 text-sm font-semibold text-[#5A3E2B] shadow-[0_14px_34px_rgba(90,62,43,0.08)] backdrop-blur transition hover:border-[rgba(185,133,82,0.35)]"
          >
            加入 LINE 綁定會員
          </Link>
        </div>
      </div>
    </section>
  );
}
