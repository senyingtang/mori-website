import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/server";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("line_binding", "/line-binding");
}

const BENEFITS = [
  "臨打／教學相關通知與候補遞補提醒",
  "會員身分與 LINE 帳號對應，降低漏接訊息",
  "未來訂單、付款與活動消息（若開放電商）",
  "球友紀錄與服務歷程集中管理（規劃中）",
];

export default async function LineBindingPage() {
  const { user, member } = await getCurrentUser();
  if (!user) {
    redirect("/login?redirect=/line-binding");
  }

  const name =
    member?.name ?? user.user_metadata?.name ?? user.email ?? "會員";
  const bound = member?.is_line_bound === true;

  return (
    <div className="pb-16">
      <div className="relative mb-8 overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.10)] bg-white/[0.06] px-6 py-8 shadow-[0_0_40px_rgba(31,20,16,0.12)] backdrop-blur-md md:px-10">
        <h1 className="text-2xl font-bold text-white md:text-3xl">LINE 綁定</h1>
        <p className="mt-2 text-sm text-white/55">
          完成綁定後，可接收報名、候補與重要通知（實際串接將於後續階段實作）。
        </p>
      </div>

      <div className="mx-auto max-w-4xl space-y-6">
        <section className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-md md:p-8">
          <h2 className="text-lg font-semibold text-white">目前狀態</h2>
          <p className="mt-3 text-sm text-white/70">
            會員：<span className="font-medium text-white">{name}</span>
          </p>
          <p className="mt-2 text-sm text-white/70">
            LINE 綁定：
            <span className="font-medium text-white">
              {bound ? "已綁定" : "尚未綁定"}
            </span>
          </p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-md md:p-8">
          <h2 className="text-lg font-semibold text-white">綁定好處</h2>
          <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-white/75">
            {BENEFITS.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-[rgba(255,255,255,0.10)] bg-[radial-gradient(circle_at_top,_rgba(205,162,116,0.14),_transparent_55%),linear-gradient(135deg,_#140f0d_0%,_#241816_50%,_#33211d_100%)] p-6 backdrop-blur-md md:p-8">
          <p className="text-sm text-white/65">
            LINE Login／OAuth callback 將於後續階段實作；本頁不提供
            Messaging API callback。
          </p>
          <button
            type="button"
            disabled
            className="mt-6 w-full cursor-not-allowed rounded-xl bg-brand-purple/40 px-6 py-3 text-sm font-semibold text-[#f8f3ea]/80 sm:w-auto"
          >
            開始 LINE 綁定（即將開放）
          </button>
        </section>
      </div>
    </div>
  );
}
