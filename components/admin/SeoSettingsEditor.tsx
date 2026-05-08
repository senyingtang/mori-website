"use client";

import { useMemo, useState, useTransition } from "react";
import { createSeoSettings, updateSeoSettings } from "@/app/admin/actions";
import { UploadField } from "@/components/admin/UploadField";

type Row = {
  id: string;
  page_key: string;
  title: string;
  meta_description: string;
  h1: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image_url: string | null;
  canonical_url: string | null;
  noindex: boolean;
  schema_json: unknown;
};

function isRow(x: unknown): x is Row {
  if (!x || typeof x !== "object") return false;
  const r = x as Record<string, unknown>;
  return (
    typeof r.id === "string" &&
    typeof r.page_key === "string" &&
    typeof r.title === "string" &&
    typeof r.meta_description === "string" &&
    typeof r.noindex === "boolean"
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

const textareaCls =
  "mt-1 w-full rounded-xl border border-[rgba(90,62,43,0.18)] bg-[#FFF8ED]/80 px-4 py-3 text-sm text-[#3A2A1E] placeholder:text-[#9A846E] outline-none focus:border-[#B98552] focus:ring-1 focus:ring-[#B98552]/20";

const textareaMonoCls =
  "mt-1 w-full rounded-xl border border-[rgba(90,62,43,0.18)] bg-[#FFF8ED]/80 px-4 py-3 font-mono text-xs text-[#3A2A1E] placeholder:text-[#9A846E] outline-none focus:border-[#B98552] focus:ring-1 focus:ring-[#B98552]/20";

const primaryBtn =
  "rounded-xl bg-[#5A3E2B] py-2.5 text-sm font-semibold text-white shadow-[0_16px_44px_rgba(90,62,43,0.22)] transition hover:bg-[#B98552] disabled:opacity-60 px-5";

const primaryBtnWide =
  "rounded-xl bg-[#5A3E2B] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_16px_44px_rgba(90,62,43,0.22)] transition hover:bg-[#B98552] disabled:opacity-60";

const secondaryChip =
  "rounded-full border border-[rgba(90,62,43,0.18)] bg-[#FFF8ED]/70 px-3 py-1.5 text-xs font-semibold text-[#5A3E2B] transition hover:border-[rgba(185,133,82,0.35)] hover:bg-[#F3DFC3]/70";

const checkRow =
  "flex items-center gap-2 rounded-xl border border-[rgba(90,62,43,0.18)] bg-[#FFF8ED]/70 px-4 py-3 text-sm font-semibold text-[#5A3E2B]";

const checkboxCls =
  "h-4 w-4 rounded border-[rgba(90,62,43,0.25)] bg-[#FFF8ED]/80 text-[#5A3E2B] focus:ring-[#B98552]/20";

type Props = {
  rows: unknown[];
  missingKeys: string[];
};

export function SeoSettingsEditor({ rows, missingKeys }: Props) {
  const initial = useMemo(
    () =>
      rows.filter(isRow).map((r) => ({
        id: r.id,
        page_key: r.page_key ?? "",
        title: r.title ?? "",
        meta_description: r.meta_description ?? "",
        h1: r.h1 ?? "",
        og_title: r.og_title ?? "",
        og_description: r.og_description ?? "",
        og_image_url: r.og_image_url ?? "",
        canonical_url: r.canonical_url ?? "",
        noindex: Boolean(r.noindex),
        schemaJson: pretty(r.schema_json),
      })),
    [rows]
  );

  const [items, setItems] = useState(initial);
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<string | null>(null);

  const [newItem, setNewItem] = useState({
    page_key: "",
    title: "",
    meta_description: "",
    h1: "",
    og_title: "",
    og_description: "",
    og_image_url: "",
    canonical_url: "",
    noindex: false,
    schema_json: "{}",
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
      const res = await updateSeoSettings(id, {
        page_key: row.page_key,
        title: row.title,
        meta_description: row.meta_description,
        h1: row.h1,
        og_title: row.og_title,
        og_description: row.og_description,
        og_image_url: row.og_image_url,
        canonical_url: row.canonical_url,
        noindex: row.noindex,
        schemaJson: row.schemaJson,
      });
      setStatus(res.success ? "已儲存。" : `儲存失敗：${res.error}`);
    });
  }

  function create() {
    setStatus(null);
    startTransition(async () => {
      const res = await createSeoSettings(newItem);
      setStatus(res.success ? "已新增。" : `新增失敗：${res.error}`);
      if (res.success) {
        setNewItem({
          page_key: "",
          title: "",
          meta_description: "",
          h1: "",
          og_title: "",
          og_description: "",
          og_image_url: "",
          canonical_url: "",
          noindex: false,
          schema_json: "{}",
        });
      }
    });
  }

  return (
    <div className="space-y-4">
      {status ? (
        <div className="rounded-xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 px-4 py-3 text-sm text-[#6F5A46]">
          {status}
        </div>
      ) : null}

      {missingKeys.length > 0 ? (
        <section className={card}>
          <h2 className="text-lg font-semibold text-[#3A2A1E]">缺少常用 page_key</h2>
          <p className="mt-2 text-sm text-[#6F5A46]">
            建議補齊以下 SEO 設定（可先用下方「新增 SEO 設定」建立）。
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {missingKeys.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => patchNew({ page_key: k })}
                className={secondaryChip}
              >
                {k}
              </button>
            ))}
          </div>
        </section>
      ) : null}

      <section className={card}>
        <h2 className="text-lg font-semibold text-[#3A2A1E]">新增 SEO 設定</h2>
        <p className="mt-2 text-sm text-[#6F5A46]">
          page_key / title / meta_description 必填；schema_json 會檢查 JSON，空白時存 {`{}` }。
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className={labelCls}>page_key *</label>
            <input
              value={newItem.page_key}
              onChange={(e) => patchNew({ page_key: e.target.value })}
              className={inputCls}
              placeholder="locations"
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelCls}>title *</label>
            <input
              value={newItem.title}
              onChange={(e) => patchNew({ title: e.target.value })}
              className={inputCls}
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelCls}>meta_description *</label>
            <textarea
              rows={3}
              value={newItem.meta_description}
              onChange={(e) => patchNew({ meta_description: e.target.value })}
              className={textareaCls}
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelCls}>h1</label>
            <input
              value={newItem.h1}
              onChange={(e) => patchNew({ h1: e.target.value })}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>og_title</label>
            <input
              value={newItem.og_title}
              onChange={(e) => patchNew({ og_title: e.target.value })}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>og_description</label>
            <input
              value={newItem.og_description}
              onChange={(e) => patchNew({ og_description: e.target.value })}
              className={inputCls}
            />
          </div>
          <div className="md:col-span-2 space-y-3">
            <UploadField
              label="og_image（上傳）"
              value={newItem.og_image_url}
              bucket="public-assets"
              pathPrefix="og"
              onUploaded={(url) => patchNew({ og_image_url: url })}
              helperText="建議 1200×630；PNG／JPG／WebP／SVG（SVG 限本 bucket）。"
            />
            <div>
              <label className={labelCls}>og_image_url（手動）</label>
              <input
                value={newItem.og_image_url}
                onChange={(e) => patchNew({ og_image_url: e.target.value })}
                className={inputCls}
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>canonical_url</label>
            <input
              value={newItem.canonical_url}
              onChange={(e) => patchNew({ canonical_url: e.target.value })}
              className={inputCls}
            />
          </div>
          <label className={`${checkRow} md:col-span-2`}>
            <input
              type="checkbox"
              checked={newItem.noindex}
              onChange={(e) => patchNew({ noindex: e.target.checked })}
              className={checkboxCls}
            />
            noindex
          </label>
        </div>

        <div className="mt-6">
          <label className={labelCls}>schema_json（JSON）</label>
          <textarea
            rows={10}
            value={newItem.schema_json}
            onChange={(e) => patchNew({ schema_json: e.target.value })}
            className={textareaMonoCls}
          />
        </div>

        <button
          type="button"
          disabled={pending}
          onClick={create}
          className={`mt-5 ${primaryBtnWide}`}
        >
          新增
        </button>
      </section>

      {items.map((row) => (
        <section key={row.id} className={card}>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#8B735C]">
                {row.page_key}
              </p>
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
            <div className="md:col-span-2">
              <label className={labelCls}>page_key（不可空白）</label>
              <input
                value={row.page_key}
                onChange={(e) => patch(row.id, { page_key: e.target.value })}
                className={inputCls}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>title</label>
              <input
                value={row.title}
                onChange={(e) => patch(row.id, { title: e.target.value })}
                className={inputCls}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>meta_description</label>
              <textarea
                rows={3}
                value={row.meta_description}
                onChange={(e) =>
                  patch(row.id, { meta_description: e.target.value })
                }
                className={textareaCls}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>h1</label>
              <input
                value={row.h1}
                onChange={(e) => patch(row.id, { h1: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>og_title</label>
              <input
                value={row.og_title}
                onChange={(e) => patch(row.id, { og_title: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>og_description</label>
              <input
                value={row.og_description}
                onChange={(e) =>
                  patch(row.id, { og_description: e.target.value })
                }
                className={inputCls}
              />
            </div>
            <div className="md:col-span-2 space-y-3">
              <UploadField
                label={`og_image（上傳）· ${row.page_key}`}
                value={row.og_image_url}
                bucket="public-assets"
                pathPrefix={`og/${row.page_key}`}
                onUploaded={(url) => patch(row.id, { og_image_url: url })}
                helperText="與手動輸入欄位共用同一欄位；上傳後會覆寫 URL。"
              />
              <div>
                <label className={labelCls}>og_image_url（手動）</label>
                <input
                  value={row.og_image_url}
                  onChange={(e) =>
                    patch(row.id, { og_image_url: e.target.value })
                  }
                  className={inputCls}
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>canonical_url</label>
              <input
                value={row.canonical_url}
                onChange={(e) =>
                  patch(row.id, { canonical_url: e.target.value })
                }
                className={inputCls}
              />
            </div>
            <label className={`${checkRow} md:col-span-2`}>
              <input
                type="checkbox"
                checked={row.noindex}
                onChange={(e) => patch(row.id, { noindex: e.target.checked })}
                className={checkboxCls}
              />
              noindex
            </label>
          </div>

          <div className="mt-6">
            <label className={labelCls}>schema_json（JSON）</label>
            <textarea
              rows={10}
              value={row.schemaJson}
              onChange={(e) => patch(row.id, { schemaJson: e.target.value })}
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
