"use client";

import { useMemo, useState, useTransition } from "react";
import { updatePolicyPage } from "@/app/admin/actions";

type Row = {
  id: string;
  page_key: string;
  title: string;
  content: string;
};

function isRow(x: unknown): x is Row {
  if (!x || typeof x !== "object") return false;
  const r = x as Record<string, unknown>;
  return (
    typeof r.id === "string" &&
    typeof r.page_key === "string" &&
    typeof r.title === "string" &&
    typeof r.content === "string"
  );
}

export function PolicyPagesEditor({ rows }: { rows: unknown[] }) {
  const initial = useMemo(
    () =>
      rows.filter(isRow).map((r) => ({
        id: r.id,
        page_key: r.page_key,
        title: r.title ?? "",
        content: r.content ?? "",
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
      const res = await updatePolicyPage(row.id, row.page_key, {
        title: row.title,
        content: row.content,
      });
      setStatus(res.success ? "已儲存。" : `儲存失敗：${res.error}`);
    });
  }

  if (items.length === 0) {
    return (
      <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-10 text-center text-sm text-white/50">
        尚無 policy_pages 資料，請先執行 migration seed。
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
                {row.page_key}
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

          <div className="mt-6 grid gap-4">
            <div>
              <label className="block text-xs font-medium text-white/55">
                title
              </label>
              <input
                value={row.title}
                onChange={(e) => patch(row.id, { title: e.target.value })}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white focus:border-brand-neon-purple/50 focus:outline-none focus:ring-1 focus:ring-brand-neon-purple/30"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/55">
                content
              </label>
              <textarea
                rows={12}
                value={row.content}
                onChange={(e) => patch(row.id, { content: e.target.value })}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/85 focus:border-brand-neon-purple/50 focus:outline-none focus:ring-1 focus:ring-brand-neon-purple/30"
              />
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

