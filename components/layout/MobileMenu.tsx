"use client";

import type { ReactNode } from "react";
import Link from "next/link";

export type NavItem = { label: string; href: string };

type Props = {
  open: boolean;
  onClose: () => void;
  navItems: NavItem[];
  ctaItems: NavItem[];
  /** 置於快捷區塊底部（例如登出按鈕） */
  extraCta?: ReactNode;
};

export function MobileMenu({
  open,
  onClose,
  navItems,
  ctaItems,
  extraCta,
}: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="主選單"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="關閉選單"
      />
      <div className="absolute right-0 top-0 flex h-full w-[min(100%,320px)] flex-col border-l border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.96)] p-6 shadow-xl backdrop-blur-md">
        <div className="mb-6 flex items-center justify-between">
          <span className="text-sm font-semibold text-[#3A2A1E]">選單</span>
          <button
            type="button"
            className="rounded-lg px-2 py-1 text-[#6F5A46] transition hover:bg-[rgba(185,133,82,0.10)] hover:text-[#3A2A1E]"
            onClick={onClose}
          >
            關閉
          </button>
        </div>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-[#5A3E2B] transition hover:bg-[rgba(185,133,82,0.10)]"
              onClick={onClose}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 border-t border-[rgba(90,62,43,0.14)] pt-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#8B735C]">
            快捷
          </p>
          <div className="flex flex-col gap-2">
            {ctaItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg bg-[#5A3E2B] px-3 py-2 text-center text-sm font-semibold text-[#FFF8ED] transition hover:bg-[#B98552]"
                onClick={onClose}
              >
                {item.label}
              </Link>
            ))}
            {extraCta ? <div className="mt-2">{extraCta}</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
