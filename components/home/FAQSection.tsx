import type { HomeSectionRow } from "@/lib/cms/types";
import type { Faq } from "@/types/cms";

type Props = {
  section: HomeSectionRow;
  faqs: Faq[];
};

const FALLBACK: { question: string; answer: string }[] = [
  {
    question: "羽球臨打需要自備球拍嗎？",
    answer:
      "建議自備球拍以利手感與安全；若臨時需要協助，可先透過聯絡我們或 LINE 詢問是否有租借或共用方案（依場館與團次公告為準）。",
  },
  {
    question: "新手可以參加臨打嗎？",
    answer:
      "可以，但請務必確認該場次的「程度限制」是否適合。若不確定自己的程度，建議先詢問團主或教練，避免場上節奏落差過大影響體驗與安全。",
  },
  {
    question: "羽球教學適合完全沒基礎的人嗎？",
    answer:
      "適合。課程會從握拍、基本步伐、發力方式與擊球節奏開始，循序建立可上場的基礎能力；你也可以先告知教練目標（例如想打好雙打銜接）。",
  },
  {
    question: "候補遞補會怎麼通知？",
    answer:
      "候補遞補為正式名單時，將透過 LINE 與網站公告流程通知（完成會員綁定與通知設定可大幅降低漏接機率）。實際通知節點以各團政策為準。",
  },
  {
    question: "球團商品什麼時候開賣？",
    answer:
      "商品籌備中，將依上架計畫陸續釋出預購／開賣資訊；你也可以先加入會員或通知名單，以便收到最新消息。",
  },
];

export function FAQSection({ section, faqs }: Props) {
  void section;
  const items =
    faqs.length > 0
      ? faqs.map((f) => ({ question: f.question, answer: f.answer }))
      : FALLBACK;

  return (
    <section className="scroll-mt-24 py-14 md:py-16">
      <h2 className="text-center text-2xl font-bold text-white md:text-3xl">
        常見問題
      </h2>
      <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-white/55">
        以下內容利於 SEO 與使用者理解；亦可由 CMS 的 faqs 表管理。
      </p>
      <div className="mx-auto mt-10 max-w-3xl space-y-3">
        {items.map((item, i) => (
          <details
            key={`${item.question}-${i}`}
            className="group rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 backdrop-blur-md open:border-purple-400/30 open:shadow-[0_0_32px_rgba(168,85,247,0.15)]"
          >
            <summary className="cursor-pointer list-none text-left text-base font-semibold text-white marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-start justify-between gap-3">
                <span>{item.question}</span>
                <span className="mt-0.5 shrink-0 text-white/40 transition group-open:rotate-180">
                  ▾
                </span>
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
