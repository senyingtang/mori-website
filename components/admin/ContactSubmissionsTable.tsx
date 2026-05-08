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
      <div className="rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 p-6 shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md">
        <form method="get" action="/admin/contact-submissions" className="space-y-4">
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-xs font-medium text-[#8B735C]">狀態</label>
              <select
                name="status"
                defaultValue={filters.status}
                className="mt-1 min-w-[140px] rounded-xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.78)] px-3 py-2 text-sm font-semibold text-[#3A2A1E] outline-none focus:border-[rgba(185,133,82,0.35)] focus:ring-1 focus:ring-[rgba(185,133,82,0.18)]"
              >
                <option value="all">全部</option>
                <option value="new">new</option>
                <option value="contacted">contacted</option>
                <option value="closed">closed</option>
                <option value="spam">spam</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#8B735C]">詢問類型</label>
              <select
                name="inquiry_type"
                defaultValue={filters.inquiry_type}
                className="mt-1 min-w-[160px] rounded-xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.78)] px-3 py-2 text-sm font-semibold text-[#3A2A1E] outline-none focus:border-[rgba(185,133,82,0.35)] focus:ring-1 focus:ring-[rgba(185,133,82,0.18)]"
              >
                <option value="all">全部</option>
                <option value="dropin">臨打報名</option>
                <option value="teaching">羽球教學</option>
                <option value="product_notify">商品通知</option>
                <option value="venue_partner">場地合作</option>
                <option value="brand_partner">品牌合作</option>
                <option value="system_partner">系統合作</option>
                <option value="other">其他</option>
              </select>
            </div>
            <div className="min-w-[200px] flex-1">
              <label className="block text-xs font-medium text-[#8B735C]">關鍵字</label>
              <input
                name="q"
                type="search"
                defaultValue={filters.q}
                placeholder="姓名、電話、Email、主旨、訊息…"
                className="mt-1 w-full rounded-xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.78)] px-3 py-2 text-sm text-[#3A2A1E] placeholder:text-[#8B735C] outline-none focus:border-[rgba(185,133,82,0.35)] focus:ring-1 focus:ring-[rgba(185,133,82,0.18)]"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-xs font-medium text-[#8B735C]">
                建立日期（起）
              </label>
              <input
                name="date_from"
                type="date"
                defaultValue={filters.date_from}
                className="mt-1 rounded-xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.78)] px-3 py-2 text-sm text-[#3A2A1E] outline-none focus:border-[rgba(185,133,82,0.35)] focus:ring-1 focus:ring-[rgba(185,133,82,0.18)]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#8B735C]">
                建立日期（迄）
              </label>
              <input
                name="date_to"
                type="date"
                defaultValue={filters.date_to}
                className="mt-1 rounded-xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.78)] px-3 py-2 text-sm text-[#3A2A1E] outline-none focus:border-[rgba(185,133,82,0.35)] focus:ring-1 focus:ring-[rgba(185,133,82,0.18)]"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-[#5A3E2B] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_16px_44px_rgba(90,62,43,0.22)] transition hover:bg-[#6B4A34]"
            >
              套用篩選
            </button>
            <Link
              href="/admin/contact-submissions"
              className="rounded-xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 px-5 py-2.5 text-sm font-semibold text-[#5A3E2B] transition hover:border-[rgba(185,133,82,0.35)]"
            >
              清除篩選
            </Link>
          </div>
        </form>
        <p className="mt-4 text-sm text-[#6F5A46]">
          共 <span className="font-semibold text-[#3A2A1E]">{totalCount}</span> 筆訊息
        </p>
      </div>

      {status ? (
        <div className="rounded-xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 px-4 py-3 text-sm text-[#6F5A46]">
          {status}
        </div>
      ) : null}

      {items.length === 0 ? (
        <div className="rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 px-6 py-12 text-center text-sm text-[#6F5A46] shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md">
          沒有符合條件的聯絡訊息。可調整篩選條件或清除篩選後再試。
        </div>
      ) : (
        items.map((r) => (
          <section
            key={r.id}
            className="rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 p-6 shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={r.status} />
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#8B735C]">
                    {fmt(r.created_at)} · {inquiryLabel(r.inquiry_type)} · {r.name}
                  </p>
                </div>
                <p className="text-xs text-[#8B735C]">id: {r.id}</p>
              </div>
              <button
                type="button"
                disabled={pending}
                onClick={() => save(r.id)}
                className="rounded-xl bg-[#5A3E2B] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_16px_44px_rgba(90,62,43,0.22)] transition hover:bg-[#6B4A34] disabled:opacity-60"
              >
                儲存
              </button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-[#8B735C]">status</label>
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
                  className="mt-1 w-full rounded-xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.78)] px-4 py-2.5 text-sm font-semibold text-[#3A2A1E] outline-none focus:border-[rgba(185,133,82,0.35)] focus:ring-1 focus:ring-[rgba(185,133,82,0.18)]"
                >
                  <option value="new">new</option>
                  <option value="contacted">contacted</option>
                  <option value="closed">closed</option>
                  <option value="spam">spam</option>
                </select>
              </div>
              <div className="space-y-1 text-sm text-[#6F5A46]">
                <p>
                  <span className="text-[#8B735C]">phone</span>：{r.phone ?? "—"}
                </p>
                <p>
                  <span className="text-[#8B735C]">email</span>：{r.email ?? "—"}
                </p>
                <p>
                  <span className="text-[#8B735C]">line_id</span>：{r.line_id ?? "—"}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-[#6F5A46]">
                  <span className="text-[#8B735C]">subject</span>：{r.subject ?? "—"}
                </p>
                <p className="mt-2 whitespace-pre-wrap rounded-xl border border-[rgba(90,62,43,0.14)] bg-[rgba(214,168,108,0.10)] px-4 py-3 text-sm text-[#6F5A46]">
                  {r.message}
                </p>
              </div>
              <div className="md:col-span-2 text-sm text-[#6F5A46]">
                <p>
                  <span className="text-[#8B735C]">source</span>：
                  {r.source_type ?? "—"} {r.source_id ?? ""}{" "}
                  {r.source_path ? `· ${r.source_path}` : ""}
                </p>
                <p className="mt-1">
                  <span className="text-[#8B735C]">utm</span>：
                  {r.utm_source ?? "—"} / {r.utm_medium ?? "—"} / {r.utm_campaign ?? "—"}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-[#8B735C]">
                  admin_note
                </label>
                <textarea
                  rows={3}
                  value={r.admin_note ?? ""}
                  onChange={(e) => patch(r.id, { admin_note: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.78)] px-4 py-3 text-sm text-[#3A2A1E] outline-none placeholder:text-[#8B735C] focus:border-[rgba(185,133,82,0.35)] focus:ring-1 focus:ring-[rgba(185,133,82,0.18)]"
                />
              </div>
            </div>
          </section>
        ))
      )}
    </div>
  );
}
