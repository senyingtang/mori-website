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

const card =
  "rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 p-6 shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md";

const labelCls = "block text-xs font-medium text-[#8B735C]";

const inputCls =
  "mt-1 w-full rounded-xl border border-[rgba(90,62,43,0.18)] bg-[#FFF8ED]/80 px-4 py-2.5 text-sm text-[#3A2A1E] placeholder:text-[#9A846E] outline-none focus:border-[#B98552] focus:ring-1 focus:ring-[#B98552]/20";

const textareaMonoCls =
  "mt-1 w-full rounded-xl border border-[rgba(90,62,43,0.18)] bg-[#FFF8ED]/80 px-4 py-3 font-mono text-xs text-[#3A2A1E] placeholder:text-[#9A846E] outline-none focus:border-[#B98552] focus:ring-1 focus:ring-[#B98552]/20";

const primaryBtn =
  "rounded-xl bg-[#5A3E2B] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_16px_44px_rgba(90,62,43,0.22)] transition hover:bg-[#B98552] disabled:opacity-60";

const checkRow =
  "flex items-center gap-2 rounded-xl border border-[rgba(90,62,43,0.18)] bg-[#FFF8ED]/70 px-4 py-3 text-sm font-semibold text-[#5A3E2B]";

const checkboxCls =
  "h-4 w-4 rounded border-[rgba(90,62,43,0.25)] bg-[#FFF8ED]/80 text-[#5A3E2B] focus:ring-[#B98552]/20";

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
        <div className="rounded-xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 px-4 py-3 text-sm text-[#6F5A46]">
          {status}
        </div>
      ) : null}

      {items.map((row) => (
        <section key={row.id} className={card}>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-semibold text-[#3A2A1E]">
                  {row.section_key}
                </h3>
                {row.is_enabled ? (
                  <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-900/90">
                    啟用
                  </span>
                ) : (
                  <span className="inline-flex rounded-full border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 px-2 py-0.5 text-[11px] font-semibold text-[#8B735C]">
                    草稿
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

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <label className={`${checkRow} md:col-span-1`}>
              <input
                type="checkbox"
                checked={row.is_enabled}
                onChange={(e) =>
                  patch(row.id, { is_enabled: e.target.checked })
                }
                className={checkboxCls}
              />
              啟用（is_enabled）
            </label>
            <div className="md:col-span-2">
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
          </div>

          <div className="mt-6">
            <label className={labelCls}>content（JSON）</label>
            <textarea
              value={row.contentJson}
              onChange={(e) => patch(row.id, { contentJson: e.target.value })}
              rows={10}
              className={textareaMonoCls}
            />
            <p className="mt-2 text-xs text-[#9A846E]">
              儲存前會檢查 JSON 是否合法。
            </p>
          </div>
        </section>
      ))}
    </div>
  );
}
