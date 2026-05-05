import Link from "next/link";
import { SafeCoverImage } from "@/components/common/SafeCoverImage";
import type { HomeSectionRow } from "@/lib/cms/types";
import type { ProductWithCategory } from "@/types/cms";

type Props = {
  section: HomeSectionRow;
  products: ProductWithCategory[];
};

function statusBadge(status: ProductWithCategory["status"]): string {
  switch (status) {
    case "coming_soon":
      return "Coming Soon";
    case "draft":
      return "草稿";
    case "active":
      return "上架";
    case "sold_out":
      return "售完";
    default:
      return status;
  }
}

export function ComingSoonProducts({ section, products }: Props) {
  void section;
  const list = products.slice(0, 6);

  return (
    <section className="scroll-mt-24 py-14 md:py-16">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            球團限定商品 Coming Soon
          </h2>
          <p className="mt-2 max-w-xl text-sm text-white/55">
            未來將推出球衣、毛巾、羽球配件與限定周邊，讓球友不只一起打球，也一起穿出球團精神。
          </p>
        </div>
        <Link
          href="/products"
          className="mt-4 inline-flex shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/90 transition hover:bg-white/10 md:mt-0"
        >
          查看全部商品
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.length === 0 ? (
          <p className="col-span-full rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-10 text-center text-sm text-white/50">
            尚無商品資料。請於後台新增 products，或確認 seed 已執行。
          </p>
        ) : (
          list.map((p) => (
            <article
              key={p.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.10)] bg-white/[0.06] opacity-95 shadow-[0_0_36px_rgba(31,20,16,0.12)] backdrop-blur-md transition hover:border-[rgba(205,162,116,0.45)] hover:opacity-100"
            >
              <div
                className={`relative aspect-[4/3] bg-gradient-to-br from-white/5 to-transparent ${
                  p.image_url?.trim()
                    ? "opacity-[0.97] saturate-[0.92] group-hover:saturate-100"
                    : "grayscale opacity-95 group-hover:grayscale-0"
                }`}
              >
                <SafeCoverImage
                  src={p.image_url}
                  alt={p.name}
                  imgClassName="absolute inset-0 h-full w-full object-cover"
                  fallback={
                    <div className="absolute inset-0 flex items-center justify-center text-3xl text-white/20">
                      🛍️
                    </div>
                  }
                />
                <span className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-0.5 text-[11px] font-semibold text-white/90 backdrop-blur">
                  {statusBadge(p.status)}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs text-white/45">
                  {p.category?.name ?? "未分類"}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-white">{p.name}</h3>
                <p className="mt-3 text-sm font-medium text-brand-neon-purple/95">
                  {p.price != null && p.price !== ""
                    ? `NT$ ${p.price}`
                    : "即將公布"}
                </p>
                {p.status === "sold_out" ? (
                  <p className="mt-2 text-xs text-white/45">已售完</p>
                ) : (
                  <Link
                    href={`/contact?type=product_notify&source_type=product&source_id=${encodeURIComponent(
                      p.id
                    )}`}
                    className="mt-4 inline-flex w-fit rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10"
                  >
                    通知我／聯絡我們
                  </Link>
                )}
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
