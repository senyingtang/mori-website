import Link from "next/link";

type Item = {
  label: string;
  href: string;
  disabled?: boolean;
  note?: string;
};

const ITEMS: Item[] = [
  { label: "總覽", href: "/admin" },
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

export function AdminSidebar() {
  return (
    <aside className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-md">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/45">
        管理模組
      </p>
      <nav className="flex flex-col gap-1">
        {ITEMS.map((item) =>
          item.disabled ? (
            <div
              key={item.href}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-white/35"
              aria-disabled
            >
              <span>{item.label}</span>
              <span className="text-[11px] text-white/30">{item.note}</span>
            </div>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </Link>
          )
        )}
      </nav>
    </aside>
  );
}

