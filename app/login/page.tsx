import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";
import { PageHero } from "@/components/layout/PageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { safeInternalRedirectPath } from "@/lib/navigation/safe-redirect";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("login", "/login");
}

type Props = {
  searchParams: Promise<{ redirect?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const sp = await searchParams;
  const redirectTo = safeInternalRedirectPath(sp.redirect, "/member-dashboard");

  return (
    <div className="mx-auto max-w-lg pb-16">
      <PageHero
        title="會員登入"
        subtitle="使用 Email 與密碼登入；登入後可前往會員中心與 LINE 綁定。"
      />
      <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-6 py-10 shadow-[0_0_40px_rgba(168,85,247,0.12)] backdrop-blur-md md:px-8">
        <div className="rounded-xl border border-brand-neon-purple/30 bg-brand-purple/10 px-4 py-3 text-sm text-white/80">
          <span className="font-medium text-brand-neon-purple">
            登入成功後將導回：
          </span>
          <code className="mt-1 block break-all text-xs text-white/70">
            {redirectTo}
          </code>
        </div>

        <LoginForm redirectTo={redirectTo} />
      </div>
    </div>
  );
}
