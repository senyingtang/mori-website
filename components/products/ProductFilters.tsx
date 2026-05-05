"use client";

import type { ProductStatusDb, ProductCategory } from "@/types/cms";

type Props = {
  categories: ProductCategory[];
  categoryId: string;
  status: "all" | ProductStatusDb;
  onCategoryChange: (v: string) => void;
  onStatusChange: (v: "all" | ProductStatusDb) => void;
  onClear: () => void;
  resultCount: number;
  totalCount: number;
};

export function ProductFilters({
  categories,
  categoryId,
  status,
  onCategoryChange,
  onStatusChange,
  onClear,
  resultCount,
  totalCount,
}: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-md">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-white/60">
          顯示 {resultCount} / {totalCount}
        </p>
        <button
          type="button"
          onClick={onClear}
          className="self-start rounded-xl border border-white/12 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10 md:self-auto"
        >
          清除篩選
        </button>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-xs font-medium text-white/55">分類</label>
          <select
            value={categoryId}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white"
          >
            <option value="all" className="bg-[#1a1028]">
              全部
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id} className="bg-[#1a1028]">
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-white/55">狀態</label>
          <select
            value={status}
            onChange={(e) =>
              onStatusChange(
                e.target.value === "draft"
                  ? "draft"
                  : e.target.value === "coming_soon"
                    ? "coming_soon"
                    : e.target.value === "active"
                      ? "active"
                      : e.target.value === "sold_out"
                        ? "sold_out"
                        : "all"
              )
            }
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white"
          >
            <option value="all" className="bg-[#1a1028]">
              全部
            </option>
            <option value="coming_soon" className="bg-[#1a1028]">
              即將開賣
            </option>
            <option value="active" className="bg-[#1a1028]">
              上架中
            </option>
            <option value="sold_out" className="bg-[#1a1028]">
              已售完
            </option>
            <option value="draft" className="bg-[#1a1028]">
              草稿
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}

