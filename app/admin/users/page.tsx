import { requireAdminUser } from "@/lib/auth/permissions";
import { canManageUsers } from "@/lib/auth/roles";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { UsersRoleEditor, type AdminUserRow } from "@/components/admin/UsersRoleEditor";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type ProfileListRow = {
  id: string;
  role: AdminUserRow["role"];
  display_name: string | null;
  created_at: string | null;
};

type MemberListRow = {
  auth_user_id: string;
  name: string;
  phone: string | null;
  email: string;
  created_at: string | null;
};

function normalizeEmail(email: string | null): string | null {
  if (!email) return null;
  const t = email.trim();
  return t ? t.toLowerCase() : null;
}

export default async function AdminUsersPage() {
  const { profile } = await requireAdminUser();
  if (!canManageUsers(profile?.role)) {
    redirect("/admin");
  }

  const supabase = await createSupabaseServerClient();

  const { data: profiles, error: pErr } = await supabase
    .from("profiles")
    .select("id, role, display_name, created_at")
    .order("created_at", { ascending: true });

  if (pErr) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-6 py-10 text-sm text-red-200/90 backdrop-blur-md">
        讀取 profiles 失敗：{pErr.message}
      </div>
    );
  }

  const pRows = (profiles ?? []) as unknown as ProfileListRow[];
  const ids = pRows.map((p) => String(p.id)).filter(Boolean);
  const { data: members, error: mErr } = await supabase
    .from("members")
    .select("auth_user_id, name, phone, email, created_at")
    .in("auth_user_id", ids);

  if (mErr) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-6 py-10 text-sm text-red-200/90 backdrop-blur-md">
        讀取 members 失敗：{mErr.message}
      </div>
    );
  }

  const mRows = (members ?? []) as unknown as MemberListRow[];
  const memMap = new Map<string, MemberListRow>();
  for (const m of mRows) {
    memMap.set(String(m.auth_user_id), m);
  }

  const rows: AdminUserRow[] = pRows.map((p) => {
    const id = String(p.id);
    const m = memMap.get(id) ?? null;
    return {
      id,
      role: String(p.role) as AdminUserRow["role"],
      display_name: p.display_name != null ? String(p.display_name) : null,
      created_at: p.created_at != null ? String(p.created_at) : null,
      email: normalizeEmail(m?.email ?? null),
      member_name: m?.name != null ? String(m.name) : null,
      member_phone: m?.phone != null ? String(m.phone) : null,
    };
  });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-6 py-8 backdrop-blur-md">
        <h1 className="text-2xl font-bold text-white">使用者與角色</h1>
        <p className="mt-2 text-sm text-white/55">
          僅限 <code className="rounded bg-black/30 px-1">super_admin</code> 管理其他使用者角色。
          系統會阻擋「最後一位 super_admin」被降級。
        </p>
      </div>

      <UsersRoleEditor rows={rows} />
    </div>
  );
}

