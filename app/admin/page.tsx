import Link from "next/link";
import { requireAdminUser } from "@/lib/auth/permissions";

export const dynamic = "force-dynamic";

function QuickCard({
  title,
  href,
  description,
}: {
  title: string;
  href: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 p-6 shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md transition hover:border-[rgba(185,133,82,0.35)]"
    >
      <p className="text-lg font-semibold text-[#3A2A1E]">{title}</p>
      <p className="mt-2 text-sm text-[#6F5A46]">{description}</p>
      <p className="mt-4 text-sm font-semibold text-[#B98552] group-hover:underline">
        前往管理 →
      </p>
    </Link>
  );
}

export default async function AdminDashboardPage() {
  const { profile } = await requireAdminUser();

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 px-6 py-8 shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md">
        <h1 className="text-2xl font-bold text-[#3A2A1E]">後台總覽</h1>
        <p className="mt-2 text-sm text-[#6F5A46]">
          目前角色：<span className="font-semibold text-[#3A2A1E]">{profile?.role}</span>
        </p>
        <p className="mt-2 text-sm text-[#8B735C]">
          地圖、據點、教練、商品管理將於後續階段開放。
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <QuickCard
          title="全站設定"
          href="/admin/site-settings"
          description="品牌、連結、聯絡方式、主題色等（site_settings）"
        />
        <QuickCard
          title="首頁區塊"
          href="/admin/home-sections"
          description="開關、排序與 content JSON（home_sections）"
        />
        <QuickCard
          title="SEO 設定"
          href="/admin/seo-settings"
          description="title/description/OG/canonical/schema（seo_settings）"
        />
        <QuickCard
          title="政策頁"
          href="/admin/policy-pages"
          description="隱私權政策與使用條款（policy_pages）"
        />
      </div>
    </div>
  );
}

