import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/server";

function supabaseHost(): string | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;
  try {
    return new URL(url).host;
  } catch {
    return null;
  }
}

export default async function MemberDebugAuthPage() {
  const { user, profile, member } = await getCurrentUser();

  if (!user) {
    redirect("/login?redirect=/member-dashboard/debug-auth");
  }

  const host = supabaseHost();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="rounded-3xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.72)] p-6 shadow-[0_24px_70px_rgba(90,62,43,0.12)]">
        <h1 className="text-xl font-bold tracking-tight text-[#3A2A1E]">
          部署排查：登入狀態 / 權限
        </h1>
        <p className="mt-2 text-sm text-[#6F5A46]">
          此頁僅供部署期間排查，確認後可刪除。
        </p>

        <div className="mt-6 space-y-4 text-sm">
          <div className="rounded-2xl border border-[rgba(90,62,43,0.12)] bg-[rgba(255,248,237,0.86)] p-4">
            <p className="font-semibold text-[#5A3E2B]">Supabase（目前環境）</p>
            <div className="mt-2 grid gap-1 text-[#3A2A1E]">
              <div>
                <span className="text-[#6F5A46]">host：</span>
                <span className="font-mono">{host ?? "（未設定或無法解析）"}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[rgba(90,62,43,0.12)] bg-[rgba(255,248,237,0.86)] p-4">
            <p className="font-semibold text-[#5A3E2B]">Auth user</p>
            <div className="mt-2 grid gap-1 text-[#3A2A1E]">
              <div>
                <span className="text-[#6F5A46]">email：</span>
                <span className="font-mono">{user.email ?? "（null）"}</span>
              </div>
              <div>
                <span className="text-[#6F5A46]">id：</span>
                <span className="font-mono">{user.id}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[rgba(90,62,43,0.12)] bg-[rgba(255,248,237,0.86)] p-4">
            <p className="font-semibold text-[#5A3E2B]">profiles</p>
            <div className="mt-2 grid gap-1 text-[#3A2A1E]">
              <div>
                <span className="text-[#6F5A46]">profile.id：</span>
                <span className="font-mono">{profile?.id ?? "（null）"}</span>
              </div>
              <div>
                <span className="text-[#6F5A46]">profile.role：</span>
                <span className="font-mono">{profile?.role ?? "（null）"}</span>
              </div>
              <div>
                <span className="text-[#6F5A46]">profile.display_name：</span>
                <span className="font-mono">
                  {profile?.display_name ?? "（null）"}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[rgba(90,62,43,0.12)] bg-[rgba(255,248,237,0.86)] p-4">
            <p className="font-semibold text-[#5A3E2B]">members</p>
            <div className="mt-2 grid gap-1 text-[#3A2A1E]">
              <div>
                <span className="text-[#6F5A46]">member.email：</span>
                <span className="font-mono">{member?.email ?? "（null）"}</span>
              </div>
              <div>
                <span className="text-[#6F5A46]">member.name：</span>
                <span className="font-mono">{member?.name ?? "（null）"}</span>
              </div>
              <div>
                <span className="text-[#6F5A46]">member.auth_user_id：</span>
                <span className="font-mono">
                  {member?.auth_user_id ?? "（null）"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-xs text-[#8B735C]">
          注意：本頁不會顯示 access token / refresh token / cookie / JWT / 密碼 /
          service_role / anon key。
        </p>
      </div>
    </div>
  );
}

