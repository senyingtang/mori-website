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
    <div className="rounded-xl border border-dashed border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 px-4 py-5">
      <p className="text-sm font-semibold text-[#3A2A1E]">{title}</p>
      <p className="mt-1 text-xs text-[#9A846E]">即將開放 · 下一階段串接資料</p>
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
      <div className="relative mb-8 overflow-hidden rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 px-6 py-8 shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md md:px-10">
        <h1 className="text-2xl font-bold text-[#3A2A1E] md:text-3xl">會員中心</h1>
        <p className="mt-2 text-sm text-[#6F5A46]">
          骨架頁面：後續將擴充報名、候補、預約與訂單模組。
        </p>
      </div>

      <div className="mx-auto max-w-4xl space-y-6">
        <section className="rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 p-6 shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md md:p-8">
          <h2 className="text-lg font-semibold text-[#3A2A1E]">基本資料</h2>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-[#8B735C]">姓名</dt>
              <dd className="mt-0.5 font-semibold text-[#3A2A1E]">{displayName}</dd>
            </div>
            <div>
              <dt className="text-[#8B735C]">Email</dt>
              <dd className="mt-0.5 font-semibold text-[#3A2A1E] break-all">
                {email}
              </dd>
            </div>
            <div>
              <dt className="text-[#8B735C]">地區</dt>
              <dd className="mt-0.5 font-semibold text-[#3A2A1E]">{city}</dd>
            </div>
            <div>
              <dt className="text-[#8B735C]">羽球程度</dt>
              <dd className="mt-0.5 font-semibold text-[#3A2A1E]">{level}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-[#8B735C]">LINE 綁定</dt>
              <dd className="mt-0.5 font-semibold text-[#3A2A1E]">
                {lineBound ? "已綁定" : "尚未綁定"}
                {!lineBound ? (
                  <Link
                    href="/line-binding"
                    className="ml-2 text-sm font-semibold text-[#B98552] hover:underline"
                  >
                    前往綁定
                  </Link>
                ) : null}
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 p-6 shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md md:p-8">
          <h2 className="text-lg font-semibold text-[#3A2A1E]">服務模組</h2>
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
