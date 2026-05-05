import type { HomeSectionRow } from "@/lib/cms/types";
import { asRecord, getRecordArray, getString } from "@/lib/cms/home-content";

type Props = {
  section: HomeSectionRow;
};

const FALLBACK = [
  {
    quote:
      "第一次參加就覺得流程很清楚，不用在群組裡翻接龍，候補通知也很方便。",
    author: "球友 A",
  },
  {
    quote:
      "程度限制蠻準的，打起來節奏舒服，不會有落差太大的問題。",
    author: "球友 B",
  },
  {
    quote:
      "教練講解很細，對新手很友善，練完真的知道自己問題在哪。",
    author: "球友 C",
  },
];

export function TestimonialsCarousel({ section }: Props) {
  const content = asRecord(section.content as unknown);
  const raw = getRecordArray(content, "items");
  const items =
    raw.length > 0
      ? raw.map((row, i) => ({
          quote:
            getString(row, "quote") ??
            FALLBACK[i]?.quote ??
            "",
          author: getString(row, "author") ?? `球友 ${i + 1}`,
        }))
      : FALLBACK;

  return (
    <section className="scroll-mt-24 py-14 md:py-16">
      <h2 className="text-center text-2xl font-bold text-white md:text-3xl">
        球友怎麼說
      </h2>
      <p className="mx-auto mt-2 max-w-xl text-center text-sm text-white/55">
        節錄真實回饋（日後可由 CMS 管理）。
      </p>
      <div className="mt-10 flex gap-4 overflow-x-auto pb-2 md:justify-center md:overflow-visible">
        {items.map((item, i) => (
          <blockquote
            key={`${item.author}-${i}`}
            className="min-w-[260px] max-w-sm shrink-0 rounded-2xl border border-white/10 bg-white/[0.05] p-6 shadow-[0_0_32px_rgba(168,85,247,0.12)] backdrop-blur-md md:min-w-0 md:flex-1"
          >
            <p className="text-sm leading-relaxed text-white/80">
              「{item.quote}」
            </p>
            <footer className="mt-4 text-xs font-medium text-white/45">
              — {item.author}
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
