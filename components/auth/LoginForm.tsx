"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { friendlyAuthMessage } from "@/lib/auth/auth-errors";
import {
  isValidEmail,
  isValidLoginPassword,
  LOGIN_PASSWORD_MIN_LENGTH,
} from "@/lib/auth/validate";

type Props = {
  redirectTo: string;
};

export function LoginForm({ redirectTo }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const registerHref = `/register?redirect=${encodeURIComponent(redirectTo)}`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const em = email.trim();
    if (!isValidEmail(em)) {
      setError("請輸入有效的 Email。");
      return;
    }
    if (!isValidLoginPassword(password)) {
      setError(`請輸入密碼（至少 ${LOGIN_PASSWORD_MIN_LENGTH} 個字元）。`);
      return;
    }

    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: signErr } = await supabase.auth.signInWithPassword({
        email: em,
        password,
      });

      if (signErr) {
        setError(friendlyAuthMessage(signErr.message));
        return;
      }

      router.refresh();
      router.push(redirectTo);
    } catch {
      setError("登入失敗，請稍後再試。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="mt-8 space-y-4" onSubmit={handleSubmit} noValidate>
      {error ? (
        <div
          role="alert"
          className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-900/95"
        >
          {error}
        </div>
      ) : null}

      <div>
        <label
          htmlFor="login-email"
          className="block text-xs font-semibold text-[#8B735C]"
        >
          Email
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="mt-1 w-full rounded-xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 px-4 py-3 text-sm text-[#3A2A1E] placeholder:text-[#9A846E] focus:border-[rgba(185,133,82,0.35)] focus:outline-none focus:ring-1 focus:ring-[rgba(185,133,82,0.22)]"
        />
      </div>
      <div>
        <label
          htmlFor="login-password"
          className="block text-xs font-semibold text-[#8B735C]"
        >
          密碼
        </label>
        <input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="mt-1 w-full rounded-xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 px-4 py-3 text-sm text-[#3A2A1E] placeholder:text-[#9A846E] focus:border-[rgba(185,133,82,0.35)] focus:outline-none focus:ring-1 focus:ring-[rgba(185,133,82,0.22)]"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-[#5A3E2B] py-3 text-sm font-semibold text-[#FFF8ED] shadow-[0_16px_42px_rgba(90,62,43,0.18)] transition hover:bg-[#B98552] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "登入中…" : "登入"}
      </button>

      <p className="text-center text-sm text-[#8B735C]">
        還沒有帳號？{" "}
        <Link
          href={registerHref}
          className="font-semibold text-[#B98552] hover:underline"
        >
          立即註冊
        </Link>
      </p>
    </form>
  );
}
