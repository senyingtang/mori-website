"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { updateContactSubmission } from "@/app/admin/actions";

export type ContactSubmissionsFilterState = {
  status: "all" | "new" | "contacted" | "closed" | "spam";
  inquiry_type: string;
  q: string;
  date_from: string;
  date_to: string;
};

type Row = {
  id: string;
  created_at: string | null;
  status: "new" | "contacted" | "closed" | "spam";
  inquiry_type: string;
  name: string;
  phone: string | null;
  email: string | null;
  line_id: string | null;
  subject: string | null;
  message: string;
  source_type: string | null;
  source_id: string | null;
  source_path: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  admin_note: string | null;
};

function isRow(x: unknown): x is Row {
  if (!x || typeof x !== "object") return false;
  const r = x as Record<string, unknown>;
  return typeof r.id === "string" && typeof r.name === "string" && typeof r.message === "string";
}

function fmt(d: string | null): string {
  if (!d) return "—";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return d;
  return dt.toLocaleString("zh-TW", { hour12: false });
}

function inquiryLabel(t: string): string {
  const map: Record<string, string> = {
    dropin: "臨打報名",
    teaching: "羽球教學",
    product_notify: "商品通知",
    venue_partner: "場地合作",
    brand_partner: "品牌合作",
    system_partner: "系統合作",
    other: "其他",
  };
  return map[t] ?? t;
}

function StatusBadge({ status }: { status: Row["status"] }) {
  const styles: Record<Row["status"], string> = {
    new: "border-sky-400/35 bg-sky-500/20 text-sky-100",
    contacted: "border-amber-400/35 bg-amber-500/20 text-amber-100",
    closed: "border-emerald-400/35 bg-emerald-500/20 text-emerald-100",
    spam: "border-red-400/35 bg-red-500/20 text-red-200",
  };
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${styles[status]}`}
    >
      {status}
    </span>
  );
}

export function ContactSubmissionsTable({
  rows,
  totalCount,
  filters,
}: {
  rows: unknown[];
  totalCount: number;
  filters: ContactSubmissionsFilterState;
}) {
  const initial = useMemo(
    () =>
      rows.filter(isRow).map((r) => ({
        ...r,
        admin_note: r.admin_note ?? "",
      })),
    [rows]
  );

  const [items, setItems] = useState(initial);
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    setItems(
      rows.filter(isRow).map((r) => ({
        ...r,
        admin_note: r.admin_note ?? "",
      }))
    );
  }, [rows]);

  function patch(id: string, next: Partial<(typeof items)[number]>) {
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, ...next } : x)));
  }

  function save(id: string) {
    setStatus(null);
    const row = items.find((x) => x.id === id);
    if (!row) return;
    startTransition(async () => {
      const res = await updateContactSubmission(id, {
        status: row.status,
        admin_note: row.admin_note ?? "",
      });
      setStatus(res.success ? "已儲存。" : `儲存失敗：${res.error}`);
    });
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-md">
        <form method="get" action="/admin/contact-submissions" className="space-y-4">
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-xs font-medium text-white/55">狀態</label>
              <select
                name="status"
                defaultValue={filters.status}
                className="mt-1 min-w-[140px] rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm text-white"
              >
                <option value="all" className="bg-[#1a1028]">
                  全部
                </option>
                <option value="new" className="bg-[#1a1028]">
                  new
                </option>
                <option value="contacted" className="bg-[#1a1028]">
                  contacted
                </option>
                <option value="closed" className="bg-[#1a1028]">
                  closed
                </option>
                <option value="spam" className="bg-[#1a1028]">
                  spam
                </option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-white/55">詢問類型</label>
              <select
                name="inquiry_type"
                defaultValue={filters.inquiry_type}
                className="mt-1 min-w-[160px] rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm text-white"
              >
                <option value="all" className="bg-[#1a1028]">
                  全部
                </option>
                <option value="dropin" className="bg-[#1a1028]">
                  臨打報名
                </option>
                <option value="teaching" className="bg-[#1a1028]">
                  羽球教學
                </option>
                <option value="product_notify" className="bg-[#1a1028]">
                  商品通知
                </option>
                <option value="venue_partner" className="bg-[#1a1028]">
                  場地合作
                </option>
                <option value="brand_partner" className="bg-[#1a1028]">
                  品牌合作
                </option>
                <option value="system_partner" className="bg-[#1a1028]">
                  系統合作
                </option>
                <option value="other" className="bg-[#1a1028]">
                  其他
                </option>
              </select>
            </div>
            <div className="min-w-[200px] flex-1">
              <label className="block text-xs font-medium text-white/55">關鍵字</label>
              <input
                name="q"
                type="search"
                defaultValue={filters.q}
                placeholder="姓名、電話、Email、主旨、訊息…"
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm text-white placeholder:text-white/35"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-xs font-medium text-white/55">建立日期（起）</label>
              <input
                name="date_from"
                type="date"
                defaultValue={filters.date_from}
                className="mt-1 rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/55">建立日期（迄）</label>
              <input
                name="date_to"
                type="date"
                defaultValue={filters.date_to}
                className="mt-1 rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm text-white"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-brand-purple to-brand-neon-purple px-5 py-2.5 text-sm font-semibold text-white"
            >
              套用篩選
            </button>
            <Link
              href="/admin/contact-submissions"
              className="rounded-xl border border-white/15 px-5 py-2.5 text-sm font-medium text-white/80 hover:bg-white/[0.06]"
            >
              清除篩選
            </Link>
          </div>
        </form>
        <p className="mt-4 text-sm text-white/70">
          共 <span className="font-semibold text-white">{totalCount}</span> 筆訊息
        </p>
      </div>

      {status ? (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/80">
          {status}
        </div>
      ) : null}

      {items.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-6 py-12 text-center text-sm text-white/55 backdrop-blur-md">
          沒有符合條件的聯絡訊息。可調整篩選條件或清除篩選後再試。
        </div>
      ) : (
        items.map((r) => (
          <section
            key={r.id}
            className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-md"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={r.status} />
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/45">
                    {fmt(r.created_at)} · {inquiryLabel(r.inquiry_type)} · {r.name}
                  </p>
                </div>
                <p className="text-xs text-white/35">id: {r.id}</p>
              </div>
              <button
                type="button"
                disabled={pending}
                onClick={() => save(r.id)}
                className="rounded-xl bg-gradient-to-r from-brand-purple to-brand-neon-purple px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              >
                儲存
              </button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-white/55">status</label>
                <select
                  value={r.status}
                  onChange={(e) =>
                    patch(r.id, {
                      status:
                        e.target.value === "contacted"
                          ? "contacted"
                          : e.target.value === "closed"
                            ? "closed"
                            : e.target.value === "spam"
                              ? "spam"
                              : "new",
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white"
                >
                  <option value="new" className="bg-[#1a1028]">
                    new
                  </option>
                  <option value="contacted" className="bg-[#1a1028]">
                    contacted
                  </option>
                  <option value="closed" className="bg-[#1a1028]">
                    closed
                  </option>
                  <option value="spam" className="bg-[#1a1028]">
                    spam
                  </option>
                </select>
              </div>
              <div className="space-y-1 text-sm text-white/70">
                <p>
                  <span className="text-white/45">phone</span>：{r.phone ?? "—"}
                </p>
                <p>
                  <span className="text-white/45">email</span>：{r.email ?? "—"}
                </p>
                <p>
                  <span className="text-white/45">line_id</span>：{r.line_id ?? "—"}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-white/70">
                  <span className="text-white/45">subject</span>：{r.subject ?? "—"}
                </p>
                <p className="mt-2 whitespace-pre-wrap rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/80">
                  {r.message}
                </p>
              </div>
              <div className="md:col-span-2 text-sm text-white/65">
                <p>
                  <span className="text-white/45">source</span>：
                  {r.source_type ?? "—"} {r.source_id ?? ""}{" "}
                  {r.source_path ? `· ${r.source_path}` : ""}
                </p>
                <p className="mt-1">
                  <span className="text-white/45">utm</span>：
                  {r.utm_source ?? "—"} / {r.utm_medium ?? "—"} / {r.utm_campaign ?? "—"}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-white/55">admin_note</label>
                <textarea
                  rows={3}
                  value={r.admin_note ?? ""}
                  onChange={(e) => patch(r.id, { admin_note: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/85"
                />
              </div>
            </div>
          </section>
        ))
      )}
    </div>
  );
}
