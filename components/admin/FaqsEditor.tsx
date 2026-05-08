"use client";

import { useMemo, useState, useTransition } from "react";
import { createFaq, updateFaq } from "@/app/admin/actions";

type Row = {
  id: string;
  page_key: string;
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
};

const PAGE_KEYS = [
  "home",
  "coaches",
  "products",
  "locations",
  "sessions",
  "contact",
  "line_binding",
] as const;

function isRow(x: unknown): x is Row {
  if (!x || typeof x !== "object") return false;
  const r = x as Record<string, unknown>;
  return (
    typeof r.id === "string" &&
    typeof r.page_key === "string" &&
    typeof r.question === "string" &&
    typeof r.answer === "string"
  );
}

const EXAMPLES: Record<string, { question: string; answer: string }[]> = {
  coaches: [
    { question: "羽球教練課適合完全新手嗎？", answer: "適合。課程會從握拍、步伐與基本擊球開始循序建立基礎。" },
    { question: "可以指定教練嗎？", answer: "可以先提出偏好，我們會依教練檔期協助安排。" },
    { question: "教學會依照程度分級嗎？", answer: "會。可依需求安排新手入門、進階訓練與雙打戰術。" },
  ],
  products: [
    { question: "商品什麼時候開賣？", answer: "將依上架計畫陸續釋出預購／開賣資訊，最新消息可至聯絡我們洽詢。" },
    { question: "可以先預購球團商品嗎？", answer: "可先登記需求，實際以開賣公告為準。" },
    { question: "商品會有尺寸表嗎？", answer: "會。上架前會提供尺寸表與建議選碼方式。" },
  ],
  locations: [
    { question: "據點會持續增加嗎？", answer: "會，將持續擴充合作場館與服務範圍。" },
    { question: "可以推薦合作場館嗎？", answer: "歡迎提供場館資訊，我們會評估交通、場地條件與合作方式。" },
    { question: "同一個據點會同時有教學與臨打嗎？", answer: "依據點而定；若同時提供，會在據點與場次資訊中標示。" },
  ],
  sessions: [
    { question: "臨打需要自備球拍嗎？", answer: "建議自備球拍；若有需要可先聯絡我們詢問是否有協助方案。" },
    { question: "場次程度限制怎麼判斷？", answer: "可依平時對戰強度、發接發與基本技術穩定度評估；不確定可先詢問。" },
    { question: "如果候補遞補成功會怎麼通知？", answer: "將依各團規則通知；完成會員與通知設定可降低漏接機率。" },
  ],
};

export function FaqsEditor({ rows }: { rows: unknown[] }) {
  const initial = useMemo(
    () =>
      rows.filter(isRow).map((r) => ({
        id: r.id,
        page_key: r.page_key ?? "home",
        question: r.question ?? "",
        answer: r.answer ?? "",
        sort_order: r.sort_order ?? 0,
        is_active: Boolean(r.is_active),
      })),
    [rows]
  );

  const [items, setItems] = useState(initial);
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<string | null>(null);

  const [newItem, setNewItem] = useState({
    page_key: "home",
    question: "",
    answer: "",
    sort_order: "0",
    is_active: true,
  });

  function patch(id: string, next: Partial<(typeof items)[number]>) {
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, ...next } : x)));
  }

  function patchNew(next: Partial<typeof newItem>) {
    setNewItem((prev) => ({ ...prev, ...next }));
  }

  function save(id: string) {
    setStatus(null);
    const row = items.find((x) => x.id === id);
    if (!row) return;
    startTransition(async () => {
      const res = await updateFaq(id, {
        page_key: row.page_key,
        question: row.question,
        answer: row.answer,
        sort_order: row.sort_order,
        is_active: row.is_active,
      });
      setStatus(res.success ? "已儲存。" : `儲存失敗：${res.error}`);
    });
  }

  function create() {
    setStatus(null);
    startTransition(async () => {
      const res = await createFaq({
        page_key: newItem.page_key,
        question: newItem.question,
        answer: newItem.answer,
        sort_order: newItem.sort_order,
        is_active: newItem.is_active,
      });
      setStatus(res.success ? "已新增。" : `新增失敗：${res.error}`);
      if (res.success) {
        setNewItem({
          page_key: "home",
          question: "",
          answer: "",
          sort_order: "0",
          is_active: true,
        });
      }
    });
  }

  const suggestion = EXAMPLES[newItem.page_key] ?? [];

  return (
    <div className="space-y-4">
      {status ? (
        <div className="rounded-xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 px-4 py-3 text-sm text-[#6F5A46]">
          {status}
        </div>
      ) : null}

      <section className="rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 p-6 shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md">
        <h2 className="text-lg font-semibold text-[#3A2A1E]">新增 FAQ</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-[#8B735C]">page_key *</label>
            <select
              value={newItem.page_key}
              onChange={(e) => patchNew({ page_key: e.target.value })}
              className="mt-1 w-full rounded-xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.78)] px-4 py-2.5 text-sm font-semibold text-[#3A2A1E] outline-none focus:border-[rgba(185,133,82,0.35)] focus:ring-1 focus:ring-[rgba(185,133,82,0.18)]"
            >
              {PAGE_KEYS.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#8B735C]">sort_order</label>
            <input
              value={newItem.sort_order}
              onChange={(e) => patchNew({ sort_order: e.target.value })}
              className="mt-1 w-full rounded-xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.78)] px-4 py-2.5 text-sm text-[#3A2A1E] outline-none focus:border-[rgba(185,133,82,0.35)] focus:ring-1 focus:ring-[rgba(185,133,82,0.18)]"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-[#8B735C]">question *</label>
            <input
              value={newItem.question}
              onChange={(e) => patchNew({ question: e.target.value })}
              className="mt-1 w-full rounded-xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.78)] px-4 py-2.5 text-sm text-[#3A2A1E] outline-none focus:border-[rgba(185,133,82,0.35)] focus:ring-1 focus:ring-[rgba(185,133,82,0.18)]"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-[#8B735C]">answer *</label>
            <textarea
              rows={4}
              value={newItem.answer}
              onChange={(e) => patchNew({ answer: e.target.value })}
              className="mt-1 w-full rounded-xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.78)] px-4 py-3 text-sm text-[#3A2A1E] outline-none placeholder:text-[#8B735C] focus:border-[rgba(185,133,82,0.35)] focus:ring-1 focus:ring-[rgba(185,133,82,0.18)]"
            />
          </div>
          <label className="flex items-center gap-2 rounded-xl border border-[rgba(90,62,43,0.14)] bg-[rgba(214,168,108,0.10)] px-4 py-3 text-sm font-semibold text-[#5A3E2B] md:col-span-2">
            <input
              type="checkbox"
              checked={newItem.is_active}
              onChange={(e) => patchNew({ is_active: e.target.checked })}
              className="h-4 w-4 rounded border-[rgba(90,62,43,0.22)] bg-[rgba(255,248,237,0.78)] text-[#5A3E2B]"
            />
            is_active
          </label>
        </div>

        {suggestion.length > 0 ? (
          <div className="mt-5 rounded-xl border border-[rgba(90,62,43,0.14)] bg-[rgba(214,168,108,0.10)] p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#8B735C]">
              常見範例（點選快速帶入）
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {suggestion.map((s) => (
                <button
                  key={s.question}
                  type="button"
                  onClick={() => patchNew({ question: s.question, answer: s.answer })}
                  className="rounded-full border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 px-3 py-1.5 text-xs font-semibold text-[#5A3E2B] transition hover:border-[rgba(185,133,82,0.35)]"
                >
                  {s.question}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <button
          type="button"
          disabled={pending}
          onClick={create}
          className="mt-5 rounded-xl bg-[#5A3E2B] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_16px_44px_rgba(90,62,43,0.22)] transition hover:bg-[#6B4A34] disabled:opacity-60"
        >
          新增
        </button>
      </section>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 px-6 py-10 text-sm text-[#6F5A46] shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md">
          目前尚無 FAQ。
        </div>
      ) : (
        items.map((row) => (
          <section
            key={row.id}
            className="rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 p-6 shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#8B735C]">
                  {row.page_key} · {row.question.slice(0, 40)}
                  {row.question.length > 40 ? "…" : ""}
                </p>
                <p className="mt-1 text-xs text-[#8B735C]">id: {row.id}</p>
              </div>
              <button
                type="button"
                disabled={pending}
                onClick={() => save(row.id)}
                className="rounded-xl bg-[#5A3E2B] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_16px_44px_rgba(90,62,43,0.22)] transition hover:bg-[#6B4A34] disabled:opacity-60"
              >
                儲存
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-[#8B735C]">page_key *</label>
                <select
                  value={row.page_key}
                  onChange={(e) => patch(row.id, { page_key: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.78)] px-4 py-2.5 text-sm font-semibold text-[#3A2A1E] outline-none focus:border-[rgba(185,133,82,0.35)] focus:ring-1 focus:ring-[rgba(185,133,82,0.18)]"
                >
                  {PAGE_KEYS.map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#8B735C]">sort_order</label>
                <input
                  value={String(row.sort_order)}
                  onChange={(e) =>
                    patch(row.id, { sort_order: Number(e.target.value || 0) })
                  }
                  className="mt-1 w-full rounded-xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.78)] px-4 py-2.5 text-sm text-[#3A2A1E] outline-none focus:border-[rgba(185,133,82,0.35)] focus:ring-1 focus:ring-[rgba(185,133,82,0.18)]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-[#8B735C]">question *</label>
                <input
                  value={row.question}
                  onChange={(e) => patch(row.id, { question: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.78)] px-4 py-2.5 text-sm text-[#3A2A1E] outline-none focus:border-[rgba(185,133,82,0.35)] focus:ring-1 focus:ring-[rgba(185,133,82,0.18)]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-[#8B735C]">answer *</label>
                <textarea
                  rows={4}
                  value={row.answer}
                  onChange={(e) => patch(row.id, { answer: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.78)] px-4 py-3 text-sm text-[#3A2A1E] outline-none placeholder:text-[#8B735C] focus:border-[rgba(185,133,82,0.35)] focus:ring-1 focus:ring-[rgba(185,133,82,0.18)]"
                />
              </div>
              <label className="flex items-center gap-2 rounded-xl border border-[rgba(90,62,43,0.14)] bg-[rgba(214,168,108,0.10)] px-4 py-3 text-sm font-semibold text-[#5A3E2B] md:col-span-2">
                <input
                  type="checkbox"
                  checked={row.is_active}
                  onChange={(e) => patch(row.id, { is_active: e.target.checked })}
                  className="h-4 w-4 rounded border-[rgba(90,62,43,0.22)] bg-[rgba(255,248,237,0.78)] text-[#5A3E2B]"
                />
                is_active
              </label>
            </div>
          </section>
        ))
      )}
    </div>
  );
}

