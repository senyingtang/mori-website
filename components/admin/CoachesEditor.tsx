"use client";

import { useMemo, useState, useTransition } from "react";
import { createCoach, updateCoach } from "@/app/admin/actions";
import { UploadField } from "@/components/admin/UploadField";

type CoachRow = {
  id: string;
  name: string;
  avatar_url: string | null;
  city: string | null;
  experience_years: number | null;
  specialties: string[] | null;
  level_tags: string[] | null;
  teaching_styles: string[] | null;
  description: string | null;
  line_contact_url: string | null;
  is_featured: boolean;
  sort_order: number;
  is_active: boolean;
};

function isCoachRow(x: unknown): x is CoachRow {
  if (!x || typeof x !== "object") return false;
  const r = x as Record<string, unknown>;
  return typeof r.id === "string" && typeof r.name === "string";
}

function joinTags(v: string[] | null): string {
  return (v ?? []).join(", ");
}

export function CoachesEditor({ rows }: { rows: unknown[] }) {
  const initial = useMemo(
    () =>
      rows.filter(isCoachRow).map((c) => ({
        id: c.id,
        name: c.name ?? "",
        avatar_url: c.avatar_url ?? "",
        city: c.city ?? "",
        experience_years: c.experience_years == null ? "" : String(c.experience_years),
        specialties_raw: joinTags(c.specialties),
        level_tags_raw: joinTags(c.level_tags),
        teaching_styles_raw: joinTags(c.teaching_styles),
        description: c.description ?? "",
        line_contact_url: c.line_contact_url ?? "",
        is_featured: Boolean(c.is_featured),
        sort_order: c.sort_order ?? 0,
        is_active: Boolean(c.is_active),
      })),
    [rows]
  );

  const [items, setItems] = useState(initial);
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<string | null>(null);

  const [newName, setNewName] = useState("");
  const [newCoachAvatarUrl, setNewCoachAvatarUrl] = useState("");

  function patch(id: string, next: Partial<(typeof items)[number]>) {
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, ...next } : x)));
  }

  function save(id: string) {
    setStatus(null);
    const row = items.find((x) => x.id === id);
    if (!row) return;
    startTransition(async () => {
      const res = await updateCoach(id, {
        name: row.name,
        avatar_url: row.avatar_url,
        city: row.city,
        experience_years: row.experience_years,
        specialties: row.specialties_raw,
        level_tags: row.level_tags_raw,
        teaching_styles: row.teaching_styles_raw,
        description: row.description,
        line_contact_url: row.line_contact_url,
        is_featured: row.is_featured,
        sort_order: row.sort_order,
        is_active: row.is_active,
      });
      setStatus(res.success ? "已儲存。" : `儲存失敗：${res.error}`);
    });
  }

  function create() {
    setStatus(null);
    startTransition(async () => {
      const res = await createCoach({
        name: newName,
        avatar_url: newCoachAvatarUrl.trim() || undefined,
      });
      setStatus(res.success ? "已新增。" : `新增失敗：${res.error}`);
      if (res.success) {
        setNewName("");
        setNewCoachAvatarUrl("");
      }
    });
  }

  return (
    <div className="space-y-4">
      {status ? (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/80">
          {status}
        </div>
      ) : null}

      <section className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-md">
        <h2 className="text-lg font-semibold text-white">新增教練</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-white/55">name *</label>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white"
              placeholder="王小明 教練"
            />
          </div>
          <div className="md:col-span-3">
            <UploadField
              label="頭像（可選，建立時一併寫入）"
              value={newCoachAvatarUrl}
              bucket="coach-avatars"
              pathPrefix="coaches/new"
              onUploaded={setNewCoachAvatarUrl}
              helperText="PNG／JPG／WebP；最多 5MB。建立後可改為 coaches/{id} 路徑再上傳。"
            />
          </div>
        </div>
        <button
          type="button"
          disabled={pending}
          onClick={create}
          className="mt-5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-neon-purple px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          新增
        </button>
      </section>

      {items.map((row) => (
        <section
          key={row.id}
          className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-md"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/45">
                {row.name || "（未命名）"} · sort {row.sort_order}
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
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-white/55">name *</label>
              <input
                value={row.name}
                onChange={(e) => patch(row.id, { name: e.target.value })}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white"
              />
            </div>
            <div className="md:col-span-2 space-y-3">
              <UploadField
                label="頭像（上傳）"
                value={row.avatar_url}
                bucket="coach-avatars"
                pathPrefix={`coaches/${row.id}`}
                onUploaded={(url) => patch(row.id, { avatar_url: url })}
                helperText="PNG／JPG／WebP；最多 5MB。"
              />
              <div>
                <label className="block text-xs font-medium text-white/55">avatar_url（手動）</label>
                <input
                  value={row.avatar_url}
                  onChange={(e) => patch(row.id, { avatar_url: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white"
                  placeholder="https://..."
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-white/55">city</label>
              <input
                value={row.city}
                onChange={(e) => patch(row.id, { city: e.target.value })}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white"
                placeholder="桃園市"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/55">experience_years</label>
              <input
                value={row.experience_years}
                onChange={(e) => patch(row.id, { experience_years: e.target.value })}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white"
                placeholder="8"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-white/55">
                specialties（逗號分隔）
              </label>
              <input
                value={row.specialties_raw}
                onChange={(e) => patch(row.id, { specialties_raw: e.target.value })}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white"
                placeholder="步伐訓練, 殺球, 雙打輪轉"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-white/55">
                level_tags（逗號分隔）
              </label>
              <input
                value={row.level_tags_raw}
                onChange={(e) => patch(row.id, { level_tags_raw: e.target.value })}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white"
                placeholder="新手, 初階, 中階"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-white/55">
                teaching_styles（逗號分隔）
              </label>
              <input
                value={row.teaching_styles_raw}
                onChange={(e) =>
                  patch(row.id, { teaching_styles_raw: e.target.value })
                }
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white"
                placeholder="循序漸進, 高密度多球, 實戰情境"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-white/55">description</label>
              <textarea
                rows={3}
                value={row.description}
                onChange={(e) => patch(row.id, { description: e.target.value })}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/85"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-white/55">line_contact_url</label>
              <input
                value={row.line_contact_url}
                onChange={(e) =>
                  patch(row.id, { line_contact_url: e.target.value })
                }
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white"
                placeholder="https://line.me/ti/p/..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/55">sort_order</label>
              <input
                value={String(row.sort_order)}
                onChange={(e) =>
                  patch(row.id, { sort_order: Number(e.target.value || 0) })
                }
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white"
              />
            </div>
            <div className="flex items-center gap-3">
              <label className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/80">
                <input
                  type="checkbox"
                  checked={row.is_active}
                  onChange={(e) => patch(row.id, { is_active: e.target.checked })}
                  className="h-4 w-4 rounded border-white/20 bg-black/30 text-brand-purple"
                />
                is_active
              </label>
              <label className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/80">
                <input
                  type="checkbox"
                  checked={row.is_featured}
                  onChange={(e) =>
                    patch(row.id, { is_featured: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-white/20 bg-black/30 text-brand-purple"
                />
                is_featured
              </label>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

