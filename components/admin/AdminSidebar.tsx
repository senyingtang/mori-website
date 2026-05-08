import Link from "next/link";
import { canManageUsers } from "@/lib/auth/roles";

type Item = {
  label: string;
  href: string;
  disabled?: boolean;
  note?: string;
};

const ITEMS: Item[] = [
  { label: "總覽", href: "/admin" },
  { label: "使用者", href: "/admin/users" },
  { label: "全站設定", href: "/admin/site-settings" },
  { label: "首頁區塊", href: "/admin/home-sections" },
  { label: "SEO 設定", href: "/admin/seo-settings" },
  { label: "FAQ", href: "/admin/faqs" },
  { label: "聯絡訊息", href: "/admin/contact-submissions" },
  { label: "政策頁", href: "/admin/policy-pages" },
  { label: "地圖縣市", href: "/admin/map-cities" },
  { label: "據點", href: "/admin/locations" },
  { label: "場次", href: "/admin/sessions" },
  { label: "教練", href: "/admin/coaches" },
  { label: "商品", href: "/admin/products" },
];

export function AdminSidebar({ role }: { role: string }) {
  const filtered = ITEMS.filter((it) => {
    if (it.href === "/admin/users") return canManageUsers(role);
    return true;
  });
  return (
    <aside className="rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 p-4 shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#8B735C]">
        管理模組
      </p>
      <nav className="flex flex-col gap-1">
        {filtered.map((item) =>
          item.disabled ? (
            <div
              key={item.href}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-[#9A846E]"
              aria-disabled
            >
              <span>{item.label}</span>
              <span className="text-[11px] text-[#9A846E]">{item.note}</span>
            </div>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-[#5A3E2B] transition hover:bg-[rgba(185,133,82,0.10)] hover:text-[#3A2A1E]"
            >
              {item.label}
            </Link>
          )
        )}
      </nav>
    </aside>
  );
}

