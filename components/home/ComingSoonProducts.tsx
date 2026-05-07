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
          <h2 className="text-2xl font-bold text-[#3A2A1E] md:text-3xl">
            球團限定商品 Coming Soon
          </h2>
          <p className="mt-2 max-w-xl text-sm text-[#6F5A46]">
            未來將推出球衣、毛巾、羽球配件與限定周邊，讓球友不只一起打球，也一起穿出球團精神。
          </p>
        </div>
        <Link
          href="/products"
          className="mt-4 inline-flex shrink-0 items-center justify-center rounded-xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 px-5 py-2.5 text-sm font-semibold text-[#5A3E2B] shadow-[0_14px_34px_rgba(90,62,43,0.08)] transition hover:border-[rgba(185,133,82,0.35)] md:mt-0"
        >
          查看全部商品
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.length === 0 ? (
          <p className="col-span-full rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 px-6 py-10 text-center text-sm text-[#8B735C]">
            尚無商品資料。請於後台新增 products，或確認 seed 已執行。
          </p>
        ) : (
          list.map((p) => (
            <article
              key={p.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.72)] opacity-95 shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md transition hover:border-[rgba(185,133,82,0.35)] hover:opacity-100"
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
                    <div className="absolute inset-0 flex items-center justify-center text-3xl text-[rgba(90,62,43,0.35)]">
                      🛍️
                    </div>
                  }
                />
                <span className="absolute left-3 top-3 rounded-full border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 px-2.5 py-0.5 text-[11px] font-semibold text-[#5A3E2B] backdrop-blur">
                  {statusBadge(p.status)}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs text-[#8B735C]">
                  {p.category?.name ?? "未分類"}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-[#3A2A1E]">{p.name}</h3>
                <p className="mt-3 text-sm font-semibold text-[#5A3E2B]">
                  {p.price != null && p.price !== ""
                    ? `NT$ ${p.price}`
                    : "即將公布"}
                </p>
                {p.status === "sold_out" ? (
                  <p className="mt-2 text-xs text-[#8B735C]">已售完</p>
                ) : (
                  <Link
                    href={`/contact?type=product_notify&source_type=product&source_id=${encodeURIComponent(
                      p.id
                    )}`}
                    className="mt-4 inline-flex w-fit rounded-xl bg-[#5A3E2B] px-4 py-2 text-sm font-semibold text-[#FFF8ED] shadow-[0_14px_34px_rgba(90,62,43,0.14)] transition hover:bg-[#B98552]"
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
