"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Props = {
  className?: string;
  /** compact：導覽列內小按鈕；mobile：手機選單全寬 */
  variant?: "compact" | "mobile";
  /** 送出登出前呼叫（例如關閉手機選單） */
  onBeforeSignOut?: () => void;
};

export function LogoutButton({
  className = "",
  variant = "compact",
  onBeforeSignOut,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    onBeforeSignOut?.();
    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signOut();
      if (error) console.error("[LogoutButton]", error.message);
      router.refresh();
      router.push("/");
    } catch (e) {
      console.error("[LogoutButton]", e);
    } finally {
      setLoading(false);
    }
  }

  const base =
    variant === "mobile"
      ? "w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-center text-sm font-medium text-white/90 hover:bg-white/10"
      : "rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-white/90 hover:bg-white/10";

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className={`${base} ${className} disabled:opacity-50`}
    >
      {loading ? "登出中…" : "登出"}
    </button>
  );
}
