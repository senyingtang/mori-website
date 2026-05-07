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
    <div className="rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 p-5 shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-[#6F5A46]">
          顯示 {resultCount} / {totalCount}
        </p>
        <button
          type="button"
          onClick={onClear}
          className="self-start rounded-xl bg-[#5A3E2B] px-4 py-2 text-sm font-semibold text-[#FFF8ED] shadow-[0_14px_34px_rgba(90,62,43,0.14)] transition hover:bg-[#B98552] md:self-auto"
        >
          清除篩選
        </button>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold text-[#8B735C]">分類</label>
          <select
            value={categoryId}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.72)] px-4 py-2.5 text-sm text-[#3A2A1E] focus:border-[rgba(185,133,82,0.35)] focus:outline-none focus:ring-1 focus:ring-[rgba(185,133,82,0.22)]"
          >
            <option value="all" className="bg-[#FFF8ED]">
              全部
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id} className="bg-[#FFF8ED]">
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#8B735C]">狀態</label>
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
            className="mt-1 w-full rounded-xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.72)] px-4 py-2.5 text-sm text-[#3A2A1E] focus:border-[rgba(185,133,82,0.35)] focus:outline-none focus:ring-1 focus:ring-[rgba(185,133,82,0.22)]"
          >
            <option value="all" className="bg-[#FFF8ED]">
              全部
            </option>
            <option value="coming_soon" className="bg-[#FFF8ED]">
              即將開賣
            </option>
            <option value="active" className="bg-[#FFF8ED]">
              上架中
            </option>
            <option value="sold_out" className="bg-[#FFF8ED]">
              已售完
            </option>
            <option value="draft" className="bg-[#FFF8ED]">
              草稿
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}

