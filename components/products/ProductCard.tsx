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
      return "bg-emerald-500/10 text-emerald-100 ring-1 ring-emerald-400/20";
    case "sold_out":
      return "bg-white/5 text-white/65 ring-1 ring-white/10";
    case "draft":
      return "bg-amber-500/10 text-amber-100 ring-1 ring-amber-400/20";
    case "coming_soon":
    default:
      return "bg-brand-purple/15 text-brand-neon-purple/95 ring-1 ring-purple-400/25";
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
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-[0_0_36px_rgba(168,85,247,0.14)] backdrop-blur-md transition hover:border-purple-400/35 hover:shadow-[0_0_48px_rgba(168,85,247,0.22)]">
      <div className="relative aspect-[4/3] bg-gradient-to-br from-white/5 to-transparent">
        <SafeCoverImage
          src={product.image_url}
          alt={product.name}
          imgClassName="absolute inset-0 h-full w-full object-cover"
          fallback={
            <div className="absolute inset-0 flex items-center justify-center text-3xl text-white/20">
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
        <p className="text-xs text-white/45">{product.category?.name ?? "未分類"}</p>
        <h3 className="mt-1 text-lg font-semibold text-white">{product.name}</h3>
        <div className="mt-3 flex items-baseline gap-2">
          <p className="text-sm font-semibold text-brand-neon-purple/95">{price}</p>
          {compareAt ? (
            <p className="text-xs text-white/40 line-through">{compareAt}</p>
          ) : null}
        </div>

        {product.description ? (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/55">
            {product.description}
          </p>
        ) : null}

        <div className="mt-6">
          {isSoldOut ? (
            <button
              type="button"
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/50"
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
              className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-brand-purple to-brand-neon-purple px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(168,85,247,0.35)] transition hover:brightness-110"
            >
              {ctaLabel}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

