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
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(185,133,82,0.35)] to-transparent" />
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl font-bold text-[#3A2A1E] md:text-3xl">
          不是傳統接龍，是更有系統的羽球體驗
        </h2>
        <p className="mt-3 text-sm text-[#6F5A46] md:text-base">
          用流程取代混亂，用資訊取代猜測。
        </p>
      </div>
      <div className="mx-auto mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <article
            key={item.title}
            className="group rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.72)] p-5 shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md transition hover:border-[rgba(185,133,82,0.35)] hover:shadow-[0_26px_72px_rgba(90,62,43,0.14)]"
          >
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF8ED]/80 text-lg ring-1 ring-[rgba(90,62,43,0.14)] transition group-hover:ring-[rgba(185,133,82,0.35)]">
              <span aria-hidden>{item.emoji}</span>
            </div>
            <h3 className="text-base font-semibold text-[#3A2A1E]">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#6F5A46]">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
