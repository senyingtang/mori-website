"use client";

import Link from "next/link";
import { SafeCoverImage } from "@/components/common/SafeCoverImage";
import type { ProductWithCategory, ProductStatusDb } from "@/types/cms";

function statusLabel(s: ProductStatusDb): string {
  switch (s) {
    case "draft":
      return "草稿";
    case "coming_soon":
      return "即將開賣";
    case "active":
      return "上架中";
    case "sold_out":
      return "已售完";
  }
}

function statusTone(s: ProductStatusDb): string {
  switch (s) {
    case "active":
      return "bg-[rgba(111,163,123,0.18)] text-[#3A2A1E] ring-1 ring-[rgba(111,163,123,0.22)]";
    case "sold_out":
      return "bg-[rgba(90,62,43,0.08)] text-[#6F5A46] ring-1 ring-[rgba(90,62,43,0.14)]";
    case "draft":
      return "bg-[rgba(214,168,108,0.16)] text-[#5A3E2B] ring-1 ring-[rgba(185,133,82,0.20)]";
    case "coming_soon":
    default:
      return "bg-[rgba(214,168,108,0.22)] text-[#5A3E2B] ring-1 ring-[rgba(185,133,82,0.24)]";
  }
}

export function ProductCard({ product }: { product: ProductWithCategory }) {
  const price =
    product.price != null && product.price !== ""
      ? `NT$ ${product.price}`
      : "即將公布";
  const compareAt =
    product.compare_at_price != null && product.compare_at_price !== ""
      ? `NT$ ${product.compare_at_price}`
      : null;

  const isSoldOut = product.status === "sold_out";
  const ctaLabel =
    product.status === "coming_soon"
      ? "通知我／聯絡我們"
      : product.status === "active"
        ? "查看商品"
        : "已售完";

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-[rgba(90,62,43,0.12)] bg-[rgba(255,248,237,0.72)] shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md transition hover:border-[rgba(185,133,82,0.35)] hover:shadow-[0_26px_72px_rgba(90,62,43,0.14)]">
      <div className="relative aspect-[4/3] bg-gradient-to-br from-[rgba(214,168,108,0.16)] to-transparent">
        <SafeCoverImage
          src={product.image_url}
          alt={product.name}
          imgClassName="absolute inset-0 h-full w-full object-cover"
          fallback={
            <div className="absolute inset-0 flex items-center justify-center text-3xl text-[rgba(90,62,43,0.35)]">
              🛍️
            </div>
          }
        />
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-[11px] font-semibold backdrop-blur ${statusTone(
            product.status
          )}`}
        >
          {statusLabel(product.status)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs text-[#8B735C]">{product.category?.name ?? "未分類"}</p>
        <h3 className="mt-1 text-lg font-semibold text-[#3A2A1E]">{product.name}</h3>
        <div className="mt-3 flex items-baseline gap-2">
          <p className="text-sm font-semibold text-[#5A3E2B]">{price}</p>
          {compareAt ? (
            <p className="text-xs text-[#8B735C] line-through">{compareAt}</p>
          ) : null}
        </div>

        {product.description ? (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[#6F5A46]">
            {product.description}
          </p>
        ) : null}

        <div className="mt-6">
          {isSoldOut ? (
            <button
              type="button"
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.62)] px-5 py-2.5 text-sm font-semibold text-[#8B735C]"
            >
              {ctaLabel}
            </button>
          ) : (
            <Link
              href={
                product.status === "coming_soon"
                  ? `/contact?type=product_notify&source_type=product&source_id=${encodeURIComponent(
                      product.id
                    )}`
                  : "/contact"
              }
              className="inline-flex w-full items-center justify-center rounded-xl bg-[#5A3E2B] px-5 py-2.5 text-sm font-semibold text-[#FFF8ED] shadow-[0_16px_42px_rgba(90,62,43,0.18)] transition hover:bg-[#B98552]"
            >
              {ctaLabel}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

