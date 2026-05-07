import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { PageHero } from "@/components/layout/PageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { safeInternalRedirectPath } from "@/lib/navigation/safe-redirect";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("register", "/register");
}

type Props = {
  searchParams: Promise<{ redirect?: string }>;
};

export default async function RegisterPage({ searchParams }: Props) {
  const sp = await searchParams;
  const redirectTo = safeInternalRedirectPath(sp.redirect, "/member-dashboard");

  return (
    <div className="mx-auto max-w-lg pb-16">
      <PageHero
        title="會員註冊"
        subtitle="建立帳號後，將由系統建立會員資料；註冊完成請依信箱指示驗證（若專案已啟用驗證）。"
      />
      <div className="rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 px-6 py-10 shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md md:px-8">
        <div className="rounded-xl border border-[rgba(185,133,82,0.28)] bg-[rgba(214,168,108,0.16)] px-4 py-3 text-sm text-[#6F5A46]">
          <span className="font-semibold text-[#5A3E2B]">
            註冊完成後預設導向：
          </span>
          <code className="mt-1 block break-all text-xs text-[#3A2A1E]">
            {redirectTo}
          </code>
        </div>

        <RegisterForm redirectTo={redirectTo} />
      </div>
    </div>
  );
}
