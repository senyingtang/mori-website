"use client";

import { useMemo, useState, useTransition } from "react";
import { updateUserRole } from "@/app/admin/actions";

type UserRole = "super_admin" | "admin" | "editor" | "coach" | "member";

export type AdminUserRow = {
  id: string;
  email: string | null;
  display_name: string | null;
  role: UserRole;
  created_at: string | null;
  member_name: string | null;
  member_phone: string | null;
};

const ROLES: { value: UserRole; label: string }[] = [
  { value: "super_admin", label: "super_admin" },
  { value: "admin", label: "admin" },
  { value: "editor", label: "editor" },
  { value: "coach", label: "coach" },
  { value: "member", label: "member" },
];

export function UsersRoleEditor({ rows }: { rows: AdminUserRow[] }) {
  const initial = useMemo(
    () =>
      rows.map((r) => ({
        ...r,
        role: r.role,
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
      const res = await updateUserRole(row.id, row.role);
      setStatus(res.success ? "已更新角色。" : `更新失敗：${res.error}`);
    });
  }

  return (
    <div className="space-y-4">
      {status ? (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/80">
          {status}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-md">
        <div className="grid grid-cols-[1.2fr_1fr_0.7fr_0.8fr] gap-0 border-b border-white/10 bg-black/20 px-4 py-3 text-xs font-semibold text-white/60">
          <div>使用者</div>
          <div>會員資料</div>
          <div>角色</div>
          <div className="text-right">操作</div>
        </div>

        <div className="divide-y divide-white/10">
          {items.map((u) => (
            <div
              key={u.id}
              className="grid grid-cols-[1.2fr_1fr_0.7fr_0.8fr] gap-0 px-4 py-4"
            >
              <div className="min-w-0 pr-4">
                <p className="truncate text-sm font-semibold text-white">
                  {u.display_name?.trim() ? u.display_name : u.email ?? "（無 email）"}
                </p>
                <p className="mt-1 truncate text-[11px] text-white/40">
                  id: {u.id}
                </p>
                <p className="mt-1 text-[11px] text-white/45">
                  created: {u.created_at ? u.created_at.slice(0, 10) : "—"}
                </p>
              </div>

              <div className="min-w-0 pr-4">
                <p className="text-sm text-white/80">
                  {u.member_name ?? "—"}
                </p>
                <p className="mt-1 text-[11px] text-white/45">
                  {u.email ?? "—"}
                </p>
                <p className="mt-1 text-[11px] text-white/45">
                  {u.member_phone ?? "—"}
                </p>
              </div>

              <div className="pr-4">
                <select
                  value={u.role}
                  disabled={pending}
                  onChange={(e) => patch(u.id, { role: e.target.value as UserRole })}
                  className="w-full rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm text-white"
                >
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-start justify-end">
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => save(u.id)}
                  className="rounded-xl bg-[#cda274] px-4 py-2 text-sm font-semibold text-[#140f0d] shadow-[0_0_24px_rgba(205,162,116,0.30)] transition hover:bg-[#e7c79c] disabled:opacity-60"
                >
                  儲存
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

