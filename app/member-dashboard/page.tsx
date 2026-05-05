import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/server";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("member_dashboard", "/member-dashboard");
}

function PlaceholderModule({ title }: { title: string }) {
  return (
    <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.03] px-4 py-5">
      <p className="text-sm font-medium text-white/75">{title}</p>
      <p className="mt-1 text-xs text-white/40">即將開放 · 下一階段串接資料</p>
    </div>
  );
}

export default async function MemberDashboardPage() {
  const { user, member } = await getCurrentUser();
  if (!user) {
    redirect("/login?redirect=/member-dashboard");
  }

  const displayName =
    member?.name ?? user.user_metadata?.name ?? user.email ?? "會員";
  const email = member?.email ?? user.email ?? "—";
  const city = member?.city ?? "—";
  const level = member?.badminton_level ?? "—";
  const lineBound = member?.is_line_bound === true;

  return (
    <div className="pb-16">
      <div className="relative mb-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] px-6 py-8 shadow-[0_0_40px_rgba(168,85,247,0.14)] backdrop-blur-md md:px-10">
        <h1 className="text-2xl font-bold text-white md:text-3xl">會員中心</h1>
        <p className="mt-2 text-sm text-white/55">
          骨架頁面：後續將擴充報名、候補、預約與訂單模組。
        </p>
      </div>

      <div className="mx-auto max-w-4xl space-y-6">
        <section className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 shadow-[0_0_32px_rgba(168,85,247,0.1)] backdrop-blur-md md:p-8">
          <h2 className="text-lg font-semibold text-white">基本資料</h2>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-white/45">姓名</dt>
              <dd className="mt-0.5 font-medium text-white/90">{displayName}</dd>
            </div>
            <div>
              <dt className="text-white/45">Email</dt>
              <dd className="mt-0.5 font-medium text-white/90 break-all">
                {email}
              </dd>
            </div>
            <div>
              <dt className="text-white/45">地區</dt>
              <dd className="mt-0.5 font-medium text-white/90">{city}</dd>
            </div>
            <div>
              <dt className="text-white/45">羽球程度</dt>
              <dd className="mt-0.5 font-medium text-white/90">{level}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-white/45">LINE 綁定</dt>
              <dd className="mt-0.5 font-medium text-white/90">
                {lineBound ? "已綁定" : "尚未綁定"}
                {!lineBound ? (
                  <Link
                    href="/line-binding"
                    className="ml-2 text-sm font-semibold text-brand-neon-purple hover:underline"
                  >
                    前往綁定
                  </Link>
                ) : null}
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-md md:p-8">
          <h2 className="text-lg font-semibold text-white">服務模組</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <PlaceholderModule title="我的臨打報名" />
            <PlaceholderModule title="我的候補狀態" />
            <PlaceholderModule title="我的教學預約" />
            <PlaceholderModule title="我的商品訂單" />
          </div>
        </section>
      </div>
    </div>
  );
}
