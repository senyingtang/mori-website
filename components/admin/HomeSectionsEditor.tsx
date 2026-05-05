"use client";

import { useMemo, useState, useTransition } from "react";
import { updateHomeSection } from "@/app/admin/actions";

type Row = {
  id: string;
  section_key: string;
  is_enabled: boolean;
  sort_order: number;
  content: unknown;
};

function isRow(x: unknown): x is Row {
  if (!x || typeof x !== "object") return false;
  const r = x as Record<string, unknown>;
  return (
    typeof r.id === "string" &&
    typeof r.section_key === "string" &&
    typeof r.is_enabled === "boolean" &&
    typeof r.sort_order === "number"
  );
}

function pretty(v: unknown): string {
  try {
    return JSON.stringify(v ?? {}, null, 2);
  } catch {
    return "{}";
  }
}

export function HomeSectionsEditor({ rows }: { rows: unknown[] }) {
  const initial = useMemo(
    () =>
      rows.filter(isRow).map((r) => ({
        id: r.id,
        section_key: r.section_key,
        is_enabled: Boolean(r.is_enabled),
        sort_order: Number(r.sort_order),
        contentJson: pretty(r.content),
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
      const res = await updateHomeSection(id, {
        is_enabled: row.is_enabled,
        sort_order: row.sort_order,
        contentJson: row.contentJson,
      });
      setStatus(res.success ? "已儲存。" : `儲存失敗：${res.error}`);
    });
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
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/45">
                {row.section_key}
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

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/80">
              <input
                type="checkbox"
                checked={row.is_enabled}
                onChange={(e) => patch(row.id, { is_enabled: e.target.checked })}
                className="h-4 w-4 rounded border-white/20 bg-black/30 text-brand-purple focus:ring-brand-neon-purple/50"
              />
              啟用（is_enabled）
            </label>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-white/55">
                sort_order
              </label>
              <input
                type="number"
                value={row.sort_order}
                onChange={(e) =>
                  patch(row.id, { sort_order: Number(e.target.value) })
                }
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white focus:border-brand-neon-purple/50 focus:outline-none focus:ring-1 focus:ring-brand-neon-purple/30"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-xs font-medium text-white/55">
              content（JSON）
            </label>
            <textarea
              value={row.contentJson}
              onChange={(e) => patch(row.id, { contentJson: e.target.value })}
              rows={10}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 font-mono text-xs text-white/85 focus:border-brand-neon-purple/50 focus:outline-none focus:ring-1 focus:ring-brand-neon-purple/30"
            />
            <p className="mt-2 text-xs text-white/40">
              儲存前會檢查 JSON 是否合法。
            </p>
          </div>
        </section>
      ))}
    </div>
  );
}

