"use client";

import { useMemo, useState, useTransition } from "react";
import { updateMapCitySetting } from "@/app/admin/actions";

type Row = {
  id: string;
  tab_type: "teaching" | "dropin";
  city: string;
  is_enabled: boolean;
  glow_color: string;
  hover_title: string;
  hover_description: string | null;
  cta_text: string;
  cta_href: string;
  location_ids: string[] | null;
  sort_order: number;
};

function isRow(x: unknown): x is Row {
  if (!x || typeof x !== "object") return false;
  const r = x as Record<string, unknown>;
  return (
    typeof r.id === "string" &&
    (r.tab_type === "teaching" || r.tab_type === "dropin") &&
    typeof r.city === "string"
  );
}

function prettyIds(ids: unknown): string {
  if (Array.isArray(ids)) return JSON.stringify(ids, null, 2);
  return "[]";
}

const card =
  "rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 p-6 shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md";

const labelCls = "block text-xs font-medium text-[#8B735C]";

const inputCls =
  "mt-1 w-full rounded-xl border border-[rgba(90,62,43,0.18)] bg-[#FFF8ED]/80 px-4 py-2.5 text-sm text-[#3A2A1E] placeholder:text-[#9A846E] outline-none focus:border-[#B98552] focus:ring-1 focus:ring-[#B98552]/20";

const textareaCls =
  "mt-1 w-full rounded-xl border border-[rgba(90,62,43,0.18)] bg-[#FFF8ED]/80 px-4 py-3 text-sm text-[#3A2A1E] placeholder:text-[#9A846E] outline-none focus:border-[#B98552] focus:ring-1 focus:ring-[#B98552]/20";

const textareaMonoCls =
  "mt-1 w-full rounded-xl border border-[rgba(90,62,43,0.18)] bg-[#FFF8ED]/80 px-4 py-3 font-mono text-xs text-[#3A2A1E] placeholder:text-[#9A846E] outline-none focus:border-[#B98552] focus:ring-1 focus:ring-[#B98552]/20";

const selectCls =
  "mt-1 w-full rounded-xl border border-[rgba(90,62,43,0.18)] bg-[#FFF8ED]/80 px-4 py-2.5 text-sm font-semibold text-[#3A2A1E] outline-none focus:border-[#B98552] focus:ring-1 focus:ring-[#B98552]/20";

const primaryBtn =
  "rounded-xl bg-[#5A3E2B] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_16px_44px_rgba(90,62,43,0.22)] transition hover:bg-[#B98552] disabled:opacity-60";

const checkRow =
  "flex items-center gap-2 rounded-xl border border-[rgba(90,62,43,0.18)] bg-[#FFF8ED]/70 px-4 py-3 text-sm font-semibold text-[#5A3E2B]";

const checkboxCls =
  "h-4 w-4 rounded border-[rgba(90,62,43,0.25)] bg-[#FFF8ED]/80 text-[#5A3E2B] focus:ring-[#B98552]/20";

export function MapCitiesEditor({ rows }: { rows: unknown[] }) {
  const initial = useMemo(
    () =>
      rows.filter(isRow).map((r) => ({
        id: r.id,
        tab_type: r.tab_type,
        city: r.city ?? "",
        is_enabled: Boolean(r.is_enabled),
        glow_color: r.glow_color ?? "",
        hover_title: r.hover_title ?? "",
        hover_description: r.hover_description ?? "",
        cta_text: r.cta_text ?? "",
        cta_href: r.cta_href ?? "",
        location_ids_raw: prettyIds(r.location_ids),
        sort_order: Number(r.sort_order ?? 0),
      })),
    [rows]
  );

  const [items, setItems] = useState(initial);
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<string | null>(null);

  function patch(id: string, next: Partial<(typeof items)[number]>) {
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, ...next } : x)));
  }

  function save(id: string) {
    setStatus(null);
    const row = items.find((x) => x.id === id);
    if (!row) return;
    startTransition(async () => {
      const res = await updateMapCitySetting(row.id, {
        tab_type: row.tab_type,
        city: row.city,
        is_enabled: row.is_enabled,
        glow_color: row.glow_color,
        hover_title: row.hover_title,
        hover_description: row.hover_description,
        cta_text: row.cta_text,
        cta_href: row.cta_href,
        location_ids_raw: row.location_ids_raw,
        sort_order: row.sort_order,
      });
      setStatus(res.success ? "已儲存。" : `儲存失敗：${res.error}`);
    });
  }

  if (items.length === 0) {
    return (
      <p className="rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 px-6 py-10 text-center text-sm text-[#6F5A46] shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md">
        尚無 map_city_settings 資料，請先執行 migration seed。
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {status ? (
        <div className="rounded-xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 px-4 py-3 text-sm text-[#6F5A46]">
          {status}
        </div>
      ) : null}

      {items.map((row) => (
        <section key={row.id} className={card}>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#8B735C]">
                  {row.tab_type} · {row.city}
                </p>
                {row.is_enabled ? (
                  <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-900/90">
                    啟用
                  </span>
                ) : (
                  <span className="inline-flex rounded-full border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 px-2 py-0.5 text-[11px] font-semibold text-[#8B735C]">
                    停用
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-[#8B735C]">id: {row.id}</p>
            </div>
            <button
              type="button"
              disabled={pending}
              onClick={() => save(row.id)}
              className={primaryBtn}
            >
              儲存
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelCls}>tab_type</label>
              <select
                value={row.tab_type}
                onChange={(e) =>
                  patch(row.id, {
                    tab_type:
                      e.target.value === "dropin" ? "dropin" : "teaching",
                  })
                }
                className={selectCls}
              >
                <option value="teaching">teaching</option>
                <option value="dropin">dropin</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>city</label>
              <input
                value={row.city}
                onChange={(e) => patch(row.id, { city: e.target.value })}
                className={inputCls}
              />
            </div>
            <label className={checkRow}>
              <input
                type="checkbox"
                checked={row.is_enabled}
                onChange={(e) =>
                  patch(row.id, { is_enabled: e.target.checked })
                }
                className={checkboxCls}
              />
              is_enabled
            </label>
            <div>
              <label className={labelCls}>sort_order</label>
              <input
                type="number"
                value={row.sort_order}
                onChange={(e) =>
                  patch(row.id, { sort_order: Number(e.target.value) })
                }
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>glow_color</label>
              <input
                value={row.glow_color}
                onChange={(e) => patch(row.id, { glow_color: e.target.value })}
                placeholder="#2563EB"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>hover_title</label>
              <input
                value={row.hover_title}
                onChange={(e) =>
                  patch(row.id, { hover_title: e.target.value })
                }
                className={inputCls}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>hover_description</label>
              <textarea
                rows={3}
                value={row.hover_description}
                onChange={(e) =>
                  patch(row.id, { hover_description: e.target.value })
                }
                className={textareaCls}
              />
            </div>
            <div>
              <label className={labelCls}>cta_text</label>
              <input
                value={row.cta_text}
                onChange={(e) => patch(row.id, { cta_text: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>cta_href</label>
              <input
                value={row.cta_href}
                onChange={(e) => patch(row.id, { cta_href: e.target.value })}
                className={inputCls}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>
                location_ids（JSON array 或逗號分隔）
              </label>
              <textarea
                rows={6}
                value={row.location_ids_raw}
                onChange={(e) =>
                  patch(row.id, { location_ids_raw: e.target.value })
                }
                className={textareaMonoCls}
              />
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
