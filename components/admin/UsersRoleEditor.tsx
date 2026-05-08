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
        <div className="rounded-xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 px-4 py-3 text-sm text-[#6F5A46]">
          {status}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md">
        <div className="grid grid-cols-[1.2fr_1fr_0.7fr_0.8fr] gap-0 border-b border-[rgba(90,62,43,0.14)] bg-[rgba(214,168,108,0.14)] px-4 py-3 text-xs font-semibold text-[#5A3E2B]">
          <div>使用者</div>
          <div>會員資料</div>
          <div>角色</div>
          <div className="text-right">操作</div>
        </div>

        <div className="divide-y divide-[rgba(90,62,43,0.14)]">
          {items.map((u) => (
            <div
              key={u.id}
              className="grid grid-cols-[1.2fr_1fr_0.7fr_0.8fr] gap-0 px-4 py-4"
            >
              <div className="min-w-0 pr-4">
                <p className="truncate text-sm font-semibold text-[#3A2A1E]">
                  {u.display_name?.trim() ? u.display_name : u.email ?? "（無 email）"}
                </p>
                <p className="mt-1 truncate text-[11px] text-[#8B735C]">
                  id: {u.id}
                </p>
                <p className="mt-1 text-[11px] text-[#8B735C]">
                  created: {u.created_at ? u.created_at.slice(0, 10) : "—"}
                </p>
              </div>

              <div className="min-w-0 pr-4">
                <p className="text-sm text-[#6F5A46]">
                  {u.member_name ?? "—"}
                </p>
                <p className="mt-1 text-[11px] text-[#8B735C]">
                  {u.email ?? "—"}
                </p>
                <p className="mt-1 text-[11px] text-[#8B735C]">
                  {u.member_phone ?? "—"}
                </p>
              </div>

              <div className="pr-4">
                <select
                  value={u.role}
                  disabled={pending}
                  onChange={(e) => patch(u.id, { role: e.target.value as UserRole })}
                  className="w-full rounded-xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 px-3 py-2 text-sm font-semibold text-[#3A2A1E] outline-none focus:border-[rgba(185,133,82,0.35)] focus:ring-1 focus:ring-[rgba(185,133,82,0.18)]"
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
                  className="rounded-xl bg-[#5A3E2B] px-4 py-2 text-sm font-semibold text-white shadow-[0_16px_44px_rgba(90,62,43,0.22)] transition hover:bg-[#6B4A34] disabled:opacity-60"
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

