import { getCurrentUser } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

export default async function AdminDebugAuthPage() {
  const bundle = await getCurrentUser();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-6 py-8 backdrop-blur-md">
        <h1 className="text-2xl font-bold text-white">Auth Debug（臨時）</h1>
        <p className="mt-2 text-sm text-white/55">
          僅用於排查 Header 未顯示「後台」：此頁只顯示 server side 讀到的 user/profile/member
          欄位，不會顯示任何 token、cookie、密碼或 JWT。
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-md">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/45">
              Auth User
            </p>
            <dl className="mt-3 space-y-2 text-sm text-white/80">
              <div className="flex items-start justify-between gap-3">
                <dt className="text-white/55">user.email</dt>
                <dd className="min-w-0 break-all text-right">
                  {bundle.user?.email ?? "null"}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="text-white/55">user.id</dt>
                <dd className="min-w-0 break-all text-right">
                  {bundle.user?.id ?? "null"}
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/45">
              Profile
            </p>
            <dl className="mt-3 space-y-2 text-sm text-white/80">
              <div className="flex items-start justify-between gap-3">
                <dt className="text-white/55">profile.role</dt>
                <dd className="min-w-0 break-all text-right">
                  {bundle.profile?.role ?? "null"}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="text-white/55">profile.display_name</dt>
                <dd className="min-w-0 break-all text-right">
                  {bundle.profile?.display_name ?? "null"}
                </dd>
              </div>
            </dl>
          </div>

          <div className="md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/45">
              Member
            </p>
            <dl className="mt-3 grid gap-2 text-sm text-white/80 md:grid-cols-2">
              <div className="flex items-start justify-between gap-3">
                <dt className="text-white/55">member.email</dt>
                <dd className="min-w-0 break-all text-right">
                  {bundle.member?.email ?? "null"}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="text-white/55">member.name</dt>
                <dd className="min-w-0 break-all text-right">
                  {bundle.member?.name ?? "null"}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

