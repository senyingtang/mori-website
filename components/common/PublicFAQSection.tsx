import type { Faq } from "@/types/cms";

type Props = {
  title: string;
  description?: string;
  faqs: Faq[];
};

export function PublicFAQSection({ title, description, faqs }: Props) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="scroll-mt-24 py-14 md:py-16">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl font-bold text-white md:text-3xl">{title}</h2>
        {description ? (
          <p className="mt-2 text-sm text-white/55">{description}</p>
        ) : null}
      </div>

      <div className="mx-auto mt-10 max-w-3xl space-y-3">
        {faqs.map((f) => (
          <details
            key={f.id}
            className="group rounded-2xl border border-[rgba(255,255,255,0.10)] bg-white/[0.06] px-5 py-4 backdrop-blur-md open:border-[rgba(205,162,116,0.45)] open:shadow-[0_0_32px_rgba(205,162,116,0.18)]"
          >
            <summary className="cursor-pointer list-none text-left text-base font-semibold text-white marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-start justify-between gap-3">
                <span>{f.question}</span>
                <span className="mt-0.5 shrink-0 text-white/40 transition group-open:rotate-180">
                  ▾
                </span>
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-white/70">{f.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

