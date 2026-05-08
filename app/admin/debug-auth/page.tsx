import { getCurrentUser } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

export default async function AdminDebugAuthPage() {
  const bundle = await getCurrentUser();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 px-6 py-8 shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md">
        <h1 className="text-2xl font-bold text-[#3A2A1E]">Auth Debug（臨時）</h1>
        <p className="mt-2 text-sm text-[#6F5A46]">
          僅用於排查 Header 未顯示「後台」：此頁只顯示 server side 讀到的 user/profile/member
          欄位，不會顯示任何 token、cookie、密碼或 JWT。
        </p>
      </div>

      <div className="rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 p-6 shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#8B735C]">
              Auth User
            </p>
            <dl className="mt-3 space-y-2 text-sm text-[#6F5A46]">
              <div className="flex items-start justify-between gap-3">
                <dt className="text-[#8B735C]">user.email</dt>
                <dd className="min-w-0 break-all text-right">
                  <span className="font-mono text-[#3A2A1E]">
                    {bundle.user?.email ?? "null"}
                  </span>
                </dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="text-[#8B735C]">user.id</dt>
                <dd className="min-w-0 break-all text-right">
                  <span className="font-mono text-[#3A2A1E]">
                    {bundle.user?.id ?? "null"}
                  </span>
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#8B735C]">
              Profile
            </p>
            <dl className="mt-3 space-y-2 text-sm text-[#6F5A46]">
              <div className="flex items-start justify-between gap-3">
                <dt className="text-[#8B735C]">profile.role</dt>
                <dd className="min-w-0 break-all text-right">
                  <span className="font-mono text-[#3A2A1E]">
                    {bundle.profile?.role ?? "null"}
                  </span>
                </dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="text-[#8B735C]">profile.display_name</dt>
                <dd className="min-w-0 break-all text-right">
                  <span className="font-mono text-[#3A2A1E]">
                    {bundle.profile?.display_name ?? "null"}
                  </span>
                </dd>
              </div>
            </dl>
          </div>

          <div className="md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#8B735C]">
              Member
            </p>
            <dl className="mt-3 grid gap-2 text-sm text-[#6F5A46] md:grid-cols-2">
              <div className="flex items-start justify-between gap-3">
                <dt className="text-[#8B735C]">member.email</dt>
                <dd className="min-w-0 break-all text-right">
                  <span className="font-mono text-[#3A2A1E]">
                    {bundle.member?.email ?? "null"}
                  </span>
                </dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="text-[#8B735C]">member.name</dt>
                <dd className="min-w-0 break-all text-right">
                  <span className="font-mono text-[#3A2A1E]">
                    {bundle.member?.name ?? "null"}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

