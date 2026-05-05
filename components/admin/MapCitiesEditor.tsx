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
      <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-10 text-center text-sm text-white/50">
        尚無 map_city_settings 資料，請先執行 migration seed。
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {status ? (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/80">
          {status}
        </div>
      ) : null}

      {items.map((row) => (
        <section
          key={row.id}
          className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-md"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/45">
                {row.tab_type} · {row.city}
              </p>
              <p className="mt-1 text-xs text-white/35">id: {row.id}</p>
            </div>
            <button
              type="button"
              disabled={pending}
              onClick={() => save(row.id)}
              className="rounded-xl bg-gradient-to-r from-brand-purple to-brand-neon-purple px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              儲存
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-white/55">
                tab_type
              </label>
              <select
                value={row.tab_type}
                onChange={(e) =>
                  patch(row.id, {
                    tab_type:
                      e.target.value === "dropin" ? "dropin" : "teaching",
                  })
                }
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white"
              >
                <option value="teaching" className="bg-[#1a1028]">
                  teaching
                </option>
                <option value="dropin" className="bg-[#1a1028]">
                  dropin
                </option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-white/55">
                city
              </label>
              <input
                value={row.city}
                onChange={(e) => patch(row.id, { city: e.target.value })}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white"
              />
            </div>
            <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/80">
              <input
                type="checkbox"
                checked={row.is_enabled}
                onChange={(e) => patch(row.id, { is_enabled: e.target.checked })}
                className="h-4 w-4 rounded border-white/20 bg-black/30 text-brand-purple focus:ring-brand-neon-purple/50"
              />
              is_enabled
            </label>
            <div>
              <label className="block text-xs font-medium text-white/55">
                sort_order
              </label>
              <input
                type="number"
                value={row.sort_order}
                onChange={(e) =>
                  patch(row.id, { sort_order: Number(e.target.value) })
                }
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/55">
                glow_color
              </label>
              <input
                value={row.glow_color}
                onChange={(e) => patch(row.id, { glow_color: e.target.value })}
                placeholder="#2563EB"
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/55">
                hover_title
              </label>
              <input
                value={row.hover_title}
                onChange={(e) => patch(row.id, { hover_title: e.target.value })}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-white/55">
                hover_description
              </label>
              <textarea
                rows={3}
                value={row.hover_description}
                onChange={(e) =>
                  patch(row.id, { hover_description: e.target.value })
                }
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/85"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/55">
                cta_text
              </label>
              <input
                value={row.cta_text}
                onChange={(e) => patch(row.id, { cta_text: e.target.value })}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/55">
                cta_href
              </label>
              <input
                value={row.cta_href}
                onChange={(e) => patch(row.id, { cta_href: e.target.value })}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-white/55">
                location_ids（JSON array 或逗號分隔）
              </label>
              <textarea
                rows={6}
                value={row.location_ids_raw}
                onChange={(e) =>
                  patch(row.id, { location_ids_raw: e.target.value })
                }
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 font-mono text-xs text-white/85"
              />
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

