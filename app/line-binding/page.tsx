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
      <div className="relative mb-8 overflow-hidden rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 px-6 py-8 shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md md:px-10">
        <h1 className="text-2xl font-bold text-[#3A2A1E] md:text-3xl">LINE 綁定</h1>
        <p className="mt-2 text-sm text-[#6F5A46]">
          完成綁定後，可接收報名、候補與重要通知（實際串接將於後續階段實作）。
        </p>
      </div>

      <div className="mx-auto max-w-4xl space-y-6">
        <section className="rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 p-6 shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md md:p-8">
          <h2 className="text-lg font-semibold text-[#3A2A1E]">目前狀態</h2>
          <p className="mt-3 text-sm text-[#6F5A46]">
            會員：<span className="font-semibold text-[#3A2A1E]">{name}</span>
          </p>
          <p className="mt-2 text-sm text-[#6F5A46]">
            LINE 綁定：
            <span className="ml-1 font-semibold text-[#3A2A1E]">
              {bound ? "已綁定" : "尚未綁定"}
            </span>
          </p>
        </section>

        <section className="rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 p-6 shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md md:p-8">
          <h2 className="text-lg font-semibold text-[#3A2A1E]">綁定好處</h2>
          <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-[#6F5A46]">
            {BENEFITS.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.72)] p-6 shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md md:p-8">
          <p className="text-sm text-[#6F5A46]">
            LINE Login／OAuth callback 將於後續階段實作；本頁不提供
            Messaging API callback。
          </p>
          <button
            type="button"
            disabled
            className="mt-6 w-full cursor-not-allowed rounded-xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 px-6 py-3 text-sm font-semibold text-[#9A846E] sm:w-auto"
          >
            開始 LINE 綁定（即將開放）
          </button>
        </section>
      </div>
    </div>
  );
}
