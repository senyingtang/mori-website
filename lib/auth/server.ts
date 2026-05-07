import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/env";
import type { CurrentUserBundle, MemberRow, ProfileRow } from "@/types/auth";

function mapProfile(row: Record<string, unknown>): ProfileRow {
  return {
    id: String(row.id),
    role: String(row.role),
    display_name: row.display_name != null ? String(row.display_name) : null,
    created_at: row.created_at != null ? String(row.created_at) : null,
    updated_at: row.updated_at != null ? String(row.updated_at) : null,
  };
}

function mapMember(row: Record<string, unknown>): MemberRow {
  return {
    id: String(row.id),
    auth_user_id: String(row.auth_user_id),
    name: String(row.name),
    phone: row.phone != null ? String(row.phone) : null,
    email: String(row.email),
    city: row.city != null ? String(row.city) : null,
    badminton_level:
      row.badminton_level != null ? String(row.badminton_level) : null,
    is_line_bound: Boolean(row.is_line_bound),
    created_at: row.created_at != null ? String(row.created_at) : null,
    updated_at: row.updated_at != null ? String(row.updated_at) : null,
  };
}

/**
 * Server 端目前登入者：Auth user + profiles + members。
 * 查詢失敗不拋錯，僅 console.error 並回傳 null 欄位。
 */
export async function getCurrentUser(): Promise<CurrentUserBundle> {
  const empty: CurrentUserBundle = {
    user: null,
    profile: null,
    member: null,
  };

  if (!hasSupabaseConfig()) return empty;

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr) {
      console.error("[getCurrentUser] auth.getUser", authErr.message);
      return empty;
    }
    if (!user) return empty;

    let profile: ProfileRow | null = null;
    try {
      const { data: p, error: pErr } = await supabase
        .from("profiles")
        .select("id, role, display_name, created_at, updated_at")
        .eq("id", user.id)
        .maybeSingle();

      if (pErr)
        console.error("[getCurrentUser] profiles", {
          userId: user.id,
          message: pErr.message,
        });
      else if (p) profile = mapProfile(p as Record<string, unknown>);
    } catch (e) {
      console.error("[getCurrentUser] profiles catch", { userId: user.id, error: e });
    }

    let member: MemberRow | null = null;
    try {
      const { data: m, error: mErr } = await supabase
        .from("members")
        .select(
          "id, auth_user_id, name, phone, email, city, badminton_level, is_line_bound, created_at, updated_at"
        )
        .eq("auth_user_id", user.id)
        .maybeSingle();

      if (mErr)
        console.error("[getCurrentUser] members", {
          userId: user.id,
          message: mErr.message,
        });
      else if (m) member = mapMember(m as Record<string, unknown>);
    } catch (e) {
      console.error("[getCurrentUser] members catch", { userId: user.id, error: e });
    }

    return { user, profile, member };
  } catch (e) {
    console.error("[getCurrentUser]", e);
    return empty;
  }
}
