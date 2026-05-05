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
  const list: Coach[] =
    coaches.length > 0
      ? coaches
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
          is_main_featured: i === 0,
          sort_order: i,
          is_active: true,
          created_at: null,
          updated_at: null,
        })) as Coach[]);

  const mainCoach =
    list.find((c) => c.is_main_featured) ??
    list.find((c) => c.is_featured) ??
    list[0] ??
    null;
  const otherCoaches =
    mainCoach == null
      ? []
      : list
          .filter((c) => c.id !== mainCoach.id)
          .filter((c) => c.is_featured || coaches.length === 0)
          .slice(0, 3);

  return (
    <section className="scroll-mt-24 py-14 md:py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold text-white md:text-3xl">教練團精選</h2>
          <p className="mt-2 text-sm text-white/55">
            專業背景與教學風格完整呈現於教練頁。
          </p>
        </div>
        <Link
          href="/coaches"
          className="inline-flex items-center justify-center rounded-xl border border-[rgba(255,255,255,0.12)] bg-white/[0.06] px-4 py-2.5 text-sm font-semibold text-white/85 backdrop-blur-md transition hover:border-[rgba(205,162,116,0.45)] hover:text-white"
        >
          查看完整教練團 →
        </Link>
      </div>

      <div className="mx-auto mt-10 max-w-6xl px-4">
        {mainCoach ? (
          <article className="overflow-hidden rounded-[1.75rem] border border-[rgba(205,162,116,0.28)] bg-[#140f0d]/55 shadow-[0_0_64px_rgba(205,162,116,0.12)] backdrop-blur-md">
            <div className="grid gap-0 md:grid-cols-[1.1fr,1.2fr]">
              <div className="relative min-h-[240px] bg-gradient-to-br from-[#33211d]/80 via-[#241816]/75 to-black/45 md:min-h-[340px]">
                <SafeCoverImage
                  src={mainCoach.avatar_url}
                  alt={mainCoach.name}
                  imgClassName="absolute inset-0 h-full w-full object-cover"
                  fallback={
                    <div className="absolute inset-0 flex items-center justify-center text-5xl text-white/20">
                      🏸
                    </div>
                  }
                />
                <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.12)] bg-black/30 px-3 py-1 text-xs font-semibold text-[#f8f3ea]/90 backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#cda274]" />
                  主教練
                </div>
              </div>

              <div className="p-6 md:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-2xl font-semibold tracking-tight text-white">
                      {mainCoach.name}
                    </h3>
                    <p className="mt-1 text-sm text-white/55">
                      {mainCoach.city ?? "—"}
                      {mainCoach.experience_years != null
                        ? ` · ${mainCoach.experience_years} 年資`
                        : ""}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {(mainCoach.specialties ?? []).slice(0, 4).map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-[rgba(255,255,255,0.10)] bg-white/[0.06] px-3 py-1 text-[12px] font-semibold text-white/80"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {(mainCoach.level_tags ?? []).slice(0, 6).map((t) => (
                    <span
                      key={t}
                      className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-white/65 ring-1 ring-white/10"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {mainCoach.description ? (
                  <p className="mt-4 text-sm leading-relaxed text-white/65">
                    {mainCoach.description}
                  </p>
                ) : null}

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                  {mainCoach.line_contact_url ? (
                    <a
                      href={mainCoach.line_contact_url}
                      className="inline-flex items-center justify-center rounded-xl bg-[#cda274] px-5 py-2.5 text-sm font-semibold text-[#140f0d] shadow-[0_0_28px_rgba(205,162,116,0.28)] transition hover:bg-[#e7c79c]"
                      target="_blank"
                      rel="noreferrer"
                    >
                      預約諮詢
                    </a>
                  ) : null}
                  <Link
                    href="/coaches"
                    className="inline-flex items-center justify-center rounded-xl border border-[rgba(255,255,255,0.12)] bg-white/[0.06] px-5 py-2.5 text-sm font-semibold text-white/85 backdrop-blur-md transition hover:border-[rgba(205,162,116,0.45)] hover:text-white"
                  >
                    查看教練團
                  </Link>
                </div>
              </div>
            </div>
          </article>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-6 py-12 text-center text-sm text-white/55 backdrop-blur-md">
            目前尚無教練資料。
          </div>
        )}

        {otherCoaches.length > 0 ? (
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {otherCoaches.map((c) => (
              <article
                key={c.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.10)] bg-white/[0.06] shadow-[0_0_36px_rgba(31,20,16,0.12)] backdrop-blur-md transition hover:border-[rgba(205,162,116,0.45)]"
              >
                <div className="relative aspect-[4/3] bg-gradient-to-br from-[#33211d]/70 via-[#241816]/70 to-black/45">
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
                    {c.experience_years != null ? ` · ${c.experience_years} 年資` : ""}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {(c.specialties ?? []).slice(0, 2).map((t) => (
                      <span
                        key={t}
                        className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-white/70 ring-1 ring-white/10"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                    <Link
                      href="/coaches"
                      className="text-sm font-semibold text-white/80 hover:text-white hover:underline"
                    >
                      查看教練團 →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
