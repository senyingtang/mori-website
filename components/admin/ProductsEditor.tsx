"use client";

import { useMemo, useState, useTransition } from "react";
import {
  createProduct,
  createProductCategory,
  updateProduct,
  updateProductCategory,
} from "@/app/admin/actions";
import { UploadField } from "@/components/admin/UploadField";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: string | null;
  compare_at_price: string | null;
  image_url: string | null;
  category_id: string | null;
  status: "draft" | "coming_soon" | "active" | "sold_out";
  stock_quantity: number;
  is_active: boolean;
  sort_order: number;
};

function isCategory(x: unknown): x is Category {
  if (!x || typeof x !== "object") return false;
  const r = x as Record<string, unknown>;
  return typeof r.id === "string" && typeof r.name === "string";
}

function isProduct(x: unknown): x is Product {
  if (!x || typeof x !== "object") return false;
  const r = x as Record<string, unknown>;
  return typeof r.id === "string" && typeof r.name === "string" && typeof r.slug === "string";
}

function slugify(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function ProductsEditor({
  products,
  categories,
}: {
  products: unknown[];
  categories: unknown[];
}) {
  const catList = useMemo(() => categories.filter(isCategory), [categories]);
  const productList = useMemo(() => products.filter(isProduct), [products]);

  const [status, setStatus] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const [items, setItems] = useState(
    productList.map((p) => ({
      id: p.id,
      name: p.name ?? "",
      slug: p.slug ?? "",
      description: p.description ?? "",
      price: p.price ?? "",
      compare_at_price: p.compare_at_price ?? "",
      image_url: p.image_url ?? "",
      category_id: p.category_id ?? "",
      status: p.status ?? "draft",
      stock_quantity: String(p.stock_quantity ?? 0),
      is_active: Boolean(p.is_active),
      sort_order: p.sort_order ?? 0,
    }))
  );

  const [catItems, setCatItems] = useState(
    catList.map((c) => ({
      id: c.id,
      name: c.name ?? "",
      slug: c.slug ?? "",
      description: c.description ?? "",
      sort_order: c.sort_order ?? 0,
      is_active: Boolean(c.is_active),
    }))
  );

  const [newProductName, setNewProductName] = useState("");
  const [newProductSlug, setNewProductSlug] = useState("");
  const [newProductStatus, setNewProductStatus] =
    useState<Product["status"]>("coming_soon");
  const [newProductImageUrl, setNewProductImageUrl] = useState("");

  const [newCatName, setNewCatName] = useState("");
  const [newCatSlug, setNewCatSlug] = useState("");

  function patchProduct(id: string, next: Partial<(typeof items)[number]>) {
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, ...next } : x)));
  }

  function patchCategory(id: string, next: Partial<(typeof catItems)[number]>) {
    setCatItems((prev) => prev.map((x) => (x.id === id ? { ...x, ...next } : x)));
  }

  function saveProduct(id: string) {
    setStatus(null);
    const row = items.find((x) => x.id === id);
    if (!row) return;
    startTransition(async () => {
      const res = await updateProduct(id, {
        name: row.name,
        slug: row.slug,
        description: row.description,
        price: row.price,
        compare_at_price: row.compare_at_price,
        image_url: row.image_url,
        category_id: row.category_id,
        status: row.status,
        stock_quantity: row.stock_quantity,
        is_active: row.is_active,
        sort_order: row.sort_order,
      });
      setStatus(res.success ? "已儲存商品。" : `儲存失敗：${res.error}`);
    });
  }

  function createNewProduct() {
    setStatus(null);
    startTransition(async () => {
      const res = await createProduct({
        name: newProductName,
        slug: newProductSlug,
        status: newProductStatus,
        image_url: newProductImageUrl.trim() || undefined,
      });
      setStatus(res.success ? "已新增商品。" : `新增失敗：${res.error}`);
      if (res.success) {
        setNewProductName("");
        setNewProductSlug("");
        setNewProductStatus("coming_soon");
        setNewProductImageUrl("");
      }
    });
  }

  function saveCategory(id: string) {
    setStatus(null);
    const row = catItems.find((x) => x.id === id);
    if (!row) return;
    startTransition(async () => {
      const res = await updateProductCategory(id, {
        name: row.name,
        slug: row.slug,
        description: row.description,
        sort_order: row.sort_order,
        is_active: row.is_active,
      });
      setStatus(res.success ? "已儲存分類。" : `儲存失敗：${res.error}`);
    });
  }

  function createNewCategory() {
    setStatus(null);
    startTransition(async () => {
      const res = await createProductCategory({
        name: newCatName,
        slug: newCatSlug,
      });
      setStatus(res.success ? "已新增分類。" : `新增失敗：${res.error}`);
      if (res.success) {
        setNewCatName("");
        setNewCatSlug("");
      }
    });
  }

  return (
    <div className="space-y-6">
      {status ? (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/80">
          {status}
        </div>
      ) : null}

      <section className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-md">
        <h2 className="text-lg font-semibold text-white">新增商品</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-xs font-medium text-white/55">name *</label>
            <input
              value={newProductName}
              onChange={(e) => {
                setNewProductName(e.target.value);
                if (!newProductSlug.trim()) setNewProductSlug(slugify(e.target.value));
              }}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white"
              placeholder="球衣 2026"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/55">slug *</label>
            <input
              value={newProductSlug}
              onChange={(e) => setNewProductSlug(slugify(e.target.value))}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white"
              placeholder="jersey-2026"
            />
            <p className="mt-1 text-[11px] text-white/40">
              僅小寫英數與 hyphen（自動轉換）。
            </p>
          </div>
          <div>
            <label className="block text-xs font-medium text-white/55">status</label>
            <select
              value={newProductStatus}
              onChange={(e) =>
                setNewProductStatus(
                  e.target.value === "draft"
                    ? "draft"
                    : e.target.value === "active"
                      ? "active"
                      : e.target.value === "sold_out"
                        ? "sold_out"
                        : "coming_soon"
                )
              }
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white"
            >
              <option value="draft" className="bg-[#1a1028]">draft</option>
              <option value="coming_soon" className="bg-[#1a1028]">coming_soon</option>
              <option value="active" className="bg-[#1a1028]">active</option>
              <option value="sold_out" className="bg-[#1a1028]">sold_out</option>
            </select>
          </div>
          <div className="md:col-span-3">
            <UploadField
              label="商品圖（可選，建立時一併寫入）"
              value={newProductImageUrl}
              bucket="product-images"
              pathPrefix="products/new"
              onUploaded={setNewProductImageUrl}
              helperText="PNG／JPG／WebP；最多 8MB。"
            />
          </div>
        </div>
        <button
          type="button"
          disabled={pending}
          onClick={createNewProduct}
          className="mt-5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-neon-purple px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          新增
        </button>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-md">
        <h2 className="text-lg font-semibold text-white">商品列表</h2>
        <div className="mt-4 space-y-4">
          {items.length === 0 ? (
            <p className="text-sm text-white/55">目前尚無商品。</p>
          ) : (
            items.map((row) => (
              <div
                key={row.id}
                className="rounded-2xl border border-white/10 bg-black/20 p-5"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/45">
                      {row.name || "（未命名）"} · {row.slug || "（無 slug）"}
                    </p>
                    <p className="mt-1 text-xs text-white/35">id: {row.id}</p>
                  </div>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => saveProduct(row.id)}
                    className="rounded-xl bg-gradient-to-r from-brand-purple to-brand-neon-purple px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    儲存
                  </button>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-white/55">name *</label>
                    <input
                      value={row.name}
                      onChange={(e) => patchProduct(row.id, { name: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/55">slug *</label>
                    <input
                      value={row.slug}
                      onChange={(e) => patchProduct(row.id, { slug: slugify(e.target.value) })}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-white/55">description</label>
                    <textarea
                      rows={3}
                      value={row.description}
                      onChange={(e) =>
                        patchProduct(row.id, { description: e.target.value })
                      }
                      className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/85"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/55">price</label>
                    <input
                      value={row.price}
                      onChange={(e) => patchProduct(row.id, { price: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white"
                      placeholder="800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/55">compare_at_price</label>
                    <input
                      value={row.compare_at_price}
                      onChange={(e) =>
                        patchProduct(row.id, { compare_at_price: e.target.value })
                      }
                      className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white"
                      placeholder="990"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-3">
                    <UploadField
                      label="商品圖（上傳）"
                      value={row.image_url}
                      bucket="product-images"
                      pathPrefix={`products/${row.id}`}
                      onUploaded={(url) => patchProduct(row.id, { image_url: url })}
                      helperText="PNG／JPG／WebP；最多 8MB。"
                    />
                    <div>
                      <label className="block text-xs font-medium text-white/55">image_url（手動）</label>
                      <input
                        value={row.image_url}
                        onChange={(e) => patchProduct(row.id, { image_url: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/55">category</label>
                    <select
                      value={row.category_id}
                      onChange={(e) =>
                        patchProduct(row.id, { category_id: e.target.value })
                      }
                      className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white"
                    >
                      <option value="" className="bg-[#1a1028]">未分類</option>
                      {catList.map((c) => (
                        <option key={c.id} value={c.id} className="bg-[#1a1028]">
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/55">status</label>
                    <select
                      value={row.status}
                      onChange={(e) =>
                        patchProduct(row.id, {
                          status:
                            e.target.value === "draft"
                              ? "draft"
                              : e.target.value === "active"
                                ? "active"
                                : e.target.value === "sold_out"
                                  ? "sold_out"
                                  : "coming_soon",
                        })
                      }
                      className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white"
                    >
                      <option value="draft" className="bg-[#1a1028]">draft</option>
                      <option value="coming_soon" className="bg-[#1a1028]">coming_soon</option>
                      <option value="active" className="bg-[#1a1028]">active</option>
                      <option value="sold_out" className="bg-[#1a1028]">sold_out</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/55">stock_quantity</label>
                    <input
                      value={row.stock_quantity}
                      onChange={(e) =>
                        patchProduct(row.id, { stock_quantity: e.target.value })
                      }
                      className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/55">sort_order</label>
                    <input
                      value={String(row.sort_order)}
                      onChange={(e) =>
                        patchProduct(row.id, { sort_order: Number(e.target.value || 0) })
                      }
                      className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white"
                    />
                  </div>
                  <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/80">
                    <input
                      type="checkbox"
                      checked={row.is_active}
                      onChange={(e) =>
                        patchProduct(row.id, { is_active: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-white/20 bg-black/30 text-brand-purple"
                    />
                    is_active
                  </label>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-md">
        <h2 className="text-lg font-semibold text-white">商品分類</h2>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-xs font-medium text-white/55">name *</label>
            <input
              value={newCatName}
              onChange={(e) => {
                setNewCatName(e.target.value);
                if (!newCatSlug.trim()) setNewCatSlug(slugify(e.target.value));
              }}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white"
              placeholder="球衣"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/55">slug *</label>
            <input
              value={newCatSlug}
              onChange={(e) => setNewCatSlug(slugify(e.target.value))}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white"
              placeholder="jerseys"
            />
          </div>
        </div>
        <button
          type="button"
          disabled={pending}
          onClick={createNewCategory}
          className="mt-5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-neon-purple px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          新增分類
        </button>

        <div className="mt-6 space-y-4">
          {catItems.length === 0 ? (
            <p className="text-sm text-white/55">目前尚無分類。</p>
          ) : (
            catItems.map((row) => (
              <div
                key={row.id}
                className="rounded-2xl border border-white/10 bg-black/20 p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/45">
                      {row.name || "（未命名）"} · {row.slug || "（無 slug）"}
                    </p>
                    <p className="mt-1 text-xs text-white/35">id: {row.id}</p>
                  </div>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => saveCategory(row.id)}
                    className="rounded-xl bg-gradient-to-r from-brand-purple to-brand-neon-purple px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    儲存
                  </button>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-white/55">name *</label>
                    <input
                      value={row.name}
                      onChange={(e) => patchCategory(row.id, { name: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/55">slug *</label>
                    <input
                      value={row.slug}
                      onChange={(e) =>
                        patchCategory(row.id, { slug: slugify(e.target.value) })
                      }
                      className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-white/55">description</label>
                    <textarea
                      rows={2}
                      value={row.description}
                      onChange={(e) =>
                        patchCategory(row.id, { description: e.target.value })
                      }
                      className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/85"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/55">sort_order</label>
                    <input
                      value={String(row.sort_order)}
                      onChange={(e) =>
                        patchCategory(row.id, { sort_order: Number(e.target.value || 0) })
                      }
                      className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white"
                    />
                  </div>
                  <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/80">
                    <input
                      type="checkbox"
                      checked={row.is_active}
                      onChange={(e) =>
                        patchCategory(row.id, { is_active: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-white/20 bg-black/30 text-brand-purple"
                    />
                    is_active
                  </label>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

