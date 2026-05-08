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

const card =
  "rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 p-6 shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md";

const labelCls = "block text-xs font-medium text-[#8B735C]";

const inputCls =
  "mt-1 w-full rounded-xl border border-[rgba(90,62,43,0.18)] bg-[#FFF8ED]/80 px-4 py-2.5 text-sm text-[#3A2A1E] placeholder:text-[#9A846E] outline-none focus:border-[#B98552] focus:ring-1 focus:ring-[#B98552]/20";

const textareaCls =
  "mt-1 w-full rounded-xl border border-[rgba(90,62,43,0.18)] bg-[#FFF8ED]/80 px-4 py-3 text-sm text-[#3A2A1E] placeholder:text-[#9A846E] outline-none focus:border-[#B98552] focus:ring-1 focus:ring-[#B98552]/20";

const primaryBtn =
  "rounded-xl bg-[#5A3E2B] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_16px_44px_rgba(90,62,43,0.22)] transition hover:bg-[#B98552] disabled:opacity-60";

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
      <p className="rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 px-6 py-10 text-center text-sm text-[#6F5A46] shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md">
        尚無 policy_pages 資料，請先執行 migration seed。
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
              <h3 className="text-base font-semibold text-[#3A2A1E]">
                {row.page_key}
              </h3>
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

          <div className="mt-6 grid gap-4">
            <div>
              <label className={labelCls}>title</label>
              <input
                value={row.title}
                onChange={(e) => patch(row.id, { title: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>content</label>
              <textarea
                rows={12}
                value={row.content}
                onChange={(e) => patch(row.id, { content: e.target.value })}
                className={textareaCls}
              />
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
