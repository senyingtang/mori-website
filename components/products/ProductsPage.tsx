"use client";

import { useMemo, useState } from "react";
import type {
  ProductCategory,
  ProductStatusDb,
  ProductWithCategory,
} from "@/types/cms";
import { PageHero } from "@/components/layout/PageHero";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductCard } from "@/components/products/ProductCard";

type Props = {
  products: ProductWithCategory[];
  categories: ProductCategory[];
};

export function ProductsPage({ products, categories }: Props) {
  const [categoryId, setCategoryId] = useState<string>("all");
  const [status, setStatus] = useState<"all" | ProductStatusDb>("all");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (categoryId !== "all" && (p.category_id ?? null) !== categoryId) return false;
      if (status !== "all" && p.status !== status) return false;
      return true;
    });
  }, [products, categoryId, status]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 md:py-12">
      <PageHero
        title="商品專區"
        subtitle="球團限定商品 Coming Soon；未來將推出球衣、毛巾、羽球配件與限定周邊。"
      />

      <div className="mb-6 rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 px-6 py-6 text-sm text-[#6F5A46] shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md">
        <p className="font-semibold text-[#3A2A1E]">球團限定商品 Coming Soon</p>
        <p className="mt-2">
          目前不提供購物車與線上結帳；若想搶先了解開賣時間與尺寸資訊，請先到聯絡我們洽詢。
        </p>
      </div>

      <ProductFilters
        categories={categories}
        categoryId={categoryId}
        status={status}
        onCategoryChange={setCategoryId}
        onStatusChange={setStatus}
        onClear={() => {
          setCategoryId("all");
          setStatus("all");
        }}
        resultCount={filtered.length}
        totalCount={products.length}
      />

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 px-6 py-12 text-center text-sm text-[#8B735C] shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md">
          目前沒有符合條件的商品。
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

