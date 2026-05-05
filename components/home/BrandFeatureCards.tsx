import type { HomeSectionRow } from "@/lib/cms/types";
import { asRecord, getRecordArray, getString } from "@/lib/cms/home-content";

type Item = { title: string; description: string; emoji: string };

const FALLBACK: Item[] = [
  {
    emoji: "📱",
    title: "LINE 報名整合",
    description:
      "不用再翻群組訊息，報名、候補、遞補通知一次完成。",
  },
  {
    emoji: "🎯",
    title: "程度分級開團",
    description:
      "依照球友程度安排場次，讓每一場都打得剛剛好。",
  },
  {
    emoji: "🏸",
    title: "專業教練團",
    description:
      "從基礎步伐、發力到實戰策略，建立真正能上場的能力。",
  },
  {
    emoji: "✨",
    title: "未來品牌商品",
    description:
      "球衣、毛巾、配件與限定周邊，打造屬於球團的品牌文化。",
  },
];

type Props = {
  section: HomeSectionRow;
};

export function BrandFeatureCards({ section }: Props) {
  const content = asRecord(section.content as unknown);
  const rawItems = getRecordArray(content, "items");
  const items: Item[] =
    rawItems.length > 0
      ? rawItems.map((row, i) => ({
          emoji:
            getString(row, "emoji") ??
            FALLBACK[i]?.emoji ??
            "•",
          title:
            getString(row, "title") ??
            FALLBACK[i]?.title ??
            "特色",
          description:
            getString(row, "description") ??
            FALLBACK[i]?.description ??
            "",
        }))
      : FALLBACK;

  return (
    <section className="relative scroll-mt-24 py-16 md:py-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl font-bold text-white md:text-3xl">
          不是傳統接龍，是更有系統的羽球體驗
        </h2>
        <p className="mt-3 text-sm text-white/55 md:text-base">
          用流程取代混亂，用資訊取代猜測。
        </p>
      </div>
      <div className="mx-auto mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <article
            key={item.title}
            className="group rounded-2xl border border-white/10 bg-white/[0.05] p-5 shadow-[0_0_40px_rgba(168,85,247,0.12)] backdrop-blur-md transition hover:border-purple-400/40 hover:shadow-[0_0_48px_rgba(168,85,247,0.28)]"
          >
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-lg ring-1 ring-white/10 transition group-hover:ring-purple-400/35">
              <span aria-hidden>{item.emoji}</span>
            </div>
            <h3 className="text-base font-semibold text-white">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/65">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
