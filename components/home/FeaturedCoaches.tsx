import Link from "next/link";
import { SafeCoverImage } from "@/components/common/SafeCoverImage";
import type { HomeSectionRow } from "@/lib/cms/types";
import type { Coach } from "@/types/cms";

type Props = {
  section: HomeSectionRow;
  coaches: Coach[];
};

const FALLBACK: Pick<
  Coach,
  "name" | "city" | "experience_years" | "specialties" | "level_tags"
>[] = [
  {
    name: "Jason 教練",
    city: "桃園",
    experience_years: 8,
    specialties: ["雙打輪轉", "實戰戰術"],
    level_tags: ["初階～中高階"],
  },
  {
    name: "Allen 教練",
    city: "中壢",
    experience_years: 5,
    specialties: ["步伐訓練", "前後場銜接"],
    level_tags: ["新手～中階"],
  },
  {
    name: "教練籌備中",
    city: "—",
    experience_years: null,
    specialties: ["—"],
    level_tags: ["敬請期待"],
  },
];

export function FeaturedCoaches({ section, coaches }: Props) {
  void section;
  const list =
    coaches.length > 0
      ? coaches.slice(0, 3)
      : (FALLBACK.map((f, i) => ({
          id: `fallback-${i}`,
          auth_user_id: null,
          name: f.name,
          avatar_url: null,
          city: f.city,
          experience_years: f.experience_years,
          specialties: f.specialties,
          level_tags: f.level_tags,
          teaching_styles: null,
          description: null,
          line_contact_url: null,
          is_featured: false,
          sort_order: i,
          is_active: true,
          created_at: null,
          updated_at: null,
        })) as Coach[]);

  return (
    <section className="scroll-mt-24 py-14 md:py-16">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl font-bold text-white md:text-3xl">教練團精選</h2>
        <p className="mt-2 text-sm text-white/55">
          專業背景與教學風格完整呈現於教練頁。
        </p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {list.map((c) => (
          <article
            key={c.id}
            className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] shadow-[0_0_36px_rgba(168,85,247,0.14)] backdrop-blur-md transition hover:border-purple-400/35"
          >
            <div className="relative aspect-[4/3] bg-gradient-to-br from-brand-purple/30 to-brand-deep-purple/60">
              <SafeCoverImage
                src={c.avatar_url}
                alt={c.name}
                imgClassName="absolute inset-0 h-full w-full object-cover"
                fallback={
                  <div className="absolute inset-0 flex items-center justify-center text-4xl text-white/25">
                    🏸
                  </div>
                }
              />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="text-lg font-semibold text-white">{c.name}</h3>
              <p className="mt-1 text-sm text-white/50">
                {c.city ?? "—"}
                {c.experience_years != null
                  ? ` · ${c.experience_years} 年資`
                  : ""}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {(c.specialties ?? []).slice(0, 4).map((t) => (
                  <span
                    key={t}
                    className="rounded-md bg-brand-blue/15 px-2 py-0.5 text-[11px] text-sky-100/90 ring-1 ring-sky-400/25"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {(c.level_tags ?? []).slice(0, 2).map((t) => (
                  <span
                    key={t}
                    className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-white/65 ring-1 ring-white/10"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                <Link
                  href="/coaches"
                  className="text-sm font-semibold text-brand-neon-purple hover:underline"
                >
                  查看教練團 →
                </Link>
                {c.line_contact_url ? (
                  <a
                    href={c.line_contact_url}
                    className="text-sm font-semibold text-white/80 hover:text-white hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    預約諮詢
                  </a>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
