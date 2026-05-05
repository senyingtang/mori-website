import Link from "next/link";
import { FooterBrandLogo } from "@/components/layout/FooterBrandLogo";

const NAV = [
  { label: "首頁", href: "/" },
  { label: "教練團介紹", href: "/coaches" },
  { label: "全部商品", href: "/products" },
  { label: "會員中心", href: "/member-dashboard" },
  { label: "聯絡我們", href: "/contact" },
];

const SERVICES = [
  { label: "羽球教學", href: "/#teaching" },
  { label: "羽球臨打", href: "/#dropin" },
  { label: "LINE 報名系統", href: "/line-binding" },
  { label: "球團商品", href: "/products" },
];

const POLICY = [
  { label: "隱私權政策", href: "/privacy-policy" },
  { label: "使用條款", href: "/terms" },
];

type Props = {
  siteName: string;
  tagline?: string;
  logoUrl?: string;
};

export function Footer({ siteName, tagline, logoUrl }: Props) {
  return (
    <footer className="border-t border-white/10 bg-[rgba(20,15,13,0.88)] backdrop-blur-md">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          {logoUrl?.trim() ? (
            <FooterBrandLogo logoUrl={logoUrl.trim()} siteName={siteName} />
          ) : null}
          <p className="text-sm font-semibold text-white">{siteName}</p>
          <p className="mt-2 text-sm leading-relaxed text-white/65">
            {tagline ??
              "讓羽球成為一種更有系統、更有溫度的運動生活。"}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-white/40">
            網站導覽
          </p>
          <ul className="mt-3 space-y-2">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-white/75 hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-white/40">
            服務項目
          </p>
          <ul className="mt-3 space-y-2">
            {SERVICES.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-white/75 hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-white/40">
            政策
          </p>
          <ul className="mt-3 space-y-2">
            {POLICY.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-white/75 hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/45">
        © {new Date().getFullYear()} {siteName}. All rights reserved.
      </div>
    </footer>
  );
}
