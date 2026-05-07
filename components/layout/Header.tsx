"use client";

import Link from "next/link";
import { useState } from "react";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { MobileMenu, type NavItem } from "@/components/layout/MobileMenu";

const NAV_ITEMS: NavItem[] = [
  { label: "首頁", href: "/" },
  { label: "據點", href: "/locations" },
  { label: "場次", href: "/sessions" },
  { label: "教練團", href: "/coaches" },
  { label: "商品專區", href: "/products" },
  { label: "聯絡我們", href: "/contact" },
];

type Props = {
  siteName: string;
  logoUrl?: string;
  isLoggedIn: boolean;
  userRole: string | null;
  displayName: string | null;
};

export function Header({ siteName, logoUrl, isLoggedIn, userRole }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const trimmedLogo = logoUrl?.trim() ?? "";
  const showLogo = Boolean(trimmedLogo) && !logoFailed;

  const canSeeAdmin =
    userRole === "super_admin" || userRole === "admin" || userRole === "editor";

  const ctaItems: NavItem[] = isLoggedIn
    ? [
        { label: "立即報名", href: "/contact" },
        { label: "LINE 綁定", href: "/line-binding" },
        { label: "會員中心", href: "/member-dashboard" },
      ]
    : [
        { label: "立即報名", href: "/contact" },
        { label: "LINE 綁定", href: "/line-binding" },
        { label: "會員登入", href: "/login" },
      ];

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[rgba(90,62,43,0.12)] bg-[rgba(255,248,237,0.86)] backdrop-blur-[16px]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5 text-sm font-semibold text-[#3A2A1E] md:text-base"
          >
            {showLogo ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element -- Supabase / 外部 logo URL */}
                <img
                  src={trimmedLogo}
                  alt={siteName}
                  className="h-9 w-auto max-h-11 object-contain md:h-10"
                  onError={() => setLogoFailed(true)}
                />
                <span className="hidden sm:inline max-w-[10rem] truncate sm:max-w-[14rem]">
                  {siteName}
                </span>
              </>
            ) : (
              <>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[rgba(185,133,82,0.22)] text-xs font-bold text-[#3A2A1E]">
                  M
                </span>
                <span className="hidden sm:inline">{siteName}</span>
              </>
            )}
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm text-[#6F5A46] transition hover:bg-[rgba(185,133,82,0.10)] hover:text-[#3A2A1E]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Link
              href="/contact"
              className="rounded-lg bg-[#5A3E2B] px-3 py-2 text-sm font-semibold text-[#FFF8ED] shadow-[0_10px_30px_rgba(90,62,43,0.18)] transition hover:bg-[#B98552]"
            >
              立即報名
            </Link>
            <Link
              href="/line-binding"
              className="rounded-lg border border-[rgba(90,62,43,0.18)] bg-[rgba(255,248,237,0.62)] px-3 py-2 text-sm font-semibold text-[#5A3E2B] shadow-[0_12px_28px_rgba(90,62,43,0.08)] transition hover:border-[rgba(185,133,82,0.35)] hover:bg-[rgba(255,248,237,0.86)]"
            >
              LINE 綁定
            </Link>
            {isLoggedIn && canSeeAdmin ? (
              <Link
                href="/admin"
                className="rounded-lg border border-[rgba(90,62,43,0.18)] bg-[rgba(255,248,237,0.62)] px-3 py-2 text-sm font-bold text-[#5A3E2B] transition hover:border-[rgba(185,133,82,0.35)] hover:bg-[rgba(255,248,237,0.86)]"
                title="後台管理"
              >
                後台
              </Link>
            ) : null}
            {isLoggedIn ? (
              <>
                <Link
                  href="/member-dashboard"
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-[#5A3E2B] transition hover:bg-[rgba(185,133,82,0.10)]"
                >
                  會員中心
                </Link>
                <LogoutButton variant="compact" />
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-sm font-semibold text-[#5A3E2B] transition hover:bg-[rgba(185,133,82,0.10)]"
              >
                會員登入
              </Link>
            )}
          </div>

          <button
            type="button"
            className="rounded-lg p-2 text-[#5A3E2B] transition hover:bg-[rgba(185,133,82,0.10)] md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="sr-only">開啟選單</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </header>

      <div id="mobile-menu">
        <MobileMenu
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          navItems={NAV_ITEMS}
          ctaItems={
            isLoggedIn && canSeeAdmin
              ? [{ label: "後台", href: "/admin" }, ...ctaItems]
              : ctaItems
          }
          extraCta={
            isLoggedIn ? (
              <LogoutButton
                variant="mobile"
                onBeforeSignOut={() => setMenuOpen(false)}
              />
            ) : null
          }
        />
      </div>
    </>
  );
}
