"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { friendlyAuthMessage } from "@/lib/auth/auth-errors";
import {
  isValidEmail,
  isValidPassword,
  PASSWORD_MIN_LENGTH,
} from "@/lib/auth/validate";

const LEVEL_OPTIONS = [
  "新手",
  "初階",
  "初中階",
  "中階",
  "中高階",
  "高階",
] as const;

type Props = {
  redirectTo: string;
};

export function RegisterForm({ redirectTo }: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [badmintonLevel, setBadmintonLevel] = useState<string>("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loginHref = `/login?redirect=${encodeURIComponent(redirectTo)}`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    const n = name.trim();
    const em = email.trim();
    if (!n) {
      setError("請填寫姓名。");
      return;
    }
    if (!isValidEmail(em)) {
      setError("請輸入有效的 Email。");
      return;
    }
    if (!badmintonLevel) {
      setError("請選擇羽球程度。");
      return;
    }
    if (!isValidPassword(password)) {
      setError(`密碼至少需 ${PASSWORD_MIN_LENGTH} 個字元。`);
      return;
    }
    if (password !== confirmPassword) {
      setError("兩次輸入的密碼不一致。");
      return;
    }
    if (!agreeTerms) {
      setError("請先閱讀並同意隱私權政策與使用條款。");
      return;
    }

    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error: signErr } = await supabase.auth.signUp({
        email: em,
        password,
        options: {
          data: {
            name: n,
            display_name: n,
            phone: phone.trim() || null,
            city: city.trim() || null,
            badminton_level: badmintonLevel,
          },
        },
      });

      if (signErr) {
        setError(friendlyAuthMessage(signErr.message));
        return;
      }

      if (data.session) {
        router.refresh();
        router.push(redirectTo);
        return;
      }

      setInfo(
        "註冊信已寄出，請至信箱完成驗證後再登入。若未收到，請檢查垃圾郵件匣。"
      );
    } catch {
      setError("註冊失敗，請稍後再試。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="mt-8 space-y-4" onSubmit={handleSubmit} noValidate>
      {error ? (
        <div
          role="alert"
          className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-100/95"
        >
          {error}
        </div>
      ) : null}
      {info ? (
        <div className="rounded-xl border border-sky-400/35 bg-sky-500/10 px-4 py-3 text-sm text-sky-50/95">
          {info}
        </div>
      ) : null}

      <div>
        <label htmlFor="reg-name" className="block text-xs font-medium text-white/50">
          姓名
        </label>
        <input
          id="reg-name"
          name="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="王小明"
          className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-brand-neon-purple/50 focus:outline-none focus:ring-1 focus:ring-brand-neon-purple/40"
        />
      </div>
      <div>
        <label htmlFor="reg-email" className="block text-xs font-medium text-white/50">
          Email
        </label>
        <input
          id="reg-email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-brand-neon-purple/50 focus:outline-none focus:ring-1 focus:ring-brand-neon-purple/40"
        />
      </div>
      <div>
        <label htmlFor="reg-phone" className="block text-xs font-medium text-white/50">
          手機
        </label>
        <input
          id="reg-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="09xxxxxxxx（選填）"
          className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-brand-neon-purple/50 focus:outline-none focus:ring-1 focus:ring-brand-neon-purple/40"
        />
      </div>
      <div>
        <label htmlFor="reg-city" className="block text-xs font-medium text-white/50">
          所在地區
        </label>
        <input
          id="reg-city"
          name="city"
          type="text"
          autoComplete="address-level2"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="例：桃園市（選填）"
          className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-brand-neon-purple/50 focus:outline-none focus:ring-1 focus:ring-brand-neon-purple/40"
        />
      </div>
      <div>
        <label htmlFor="reg-level" className="block text-xs font-medium text-white/50">
          羽球程度
        </label>
        <select
          id="reg-level"
          name="badminton_level"
          value={badmintonLevel}
          onChange={(e) => setBadmintonLevel(e.target.value)}
          className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white focus:border-brand-neon-purple/50 focus:outline-none focus:ring-1 focus:ring-brand-neon-purple/40"
        >
          <option value="" disabled>
            請選擇
          </option>
          {LEVEL_OPTIONS.map((opt) => (
            <option key={opt} value={opt} className="bg-[#1a1028]">
              {opt}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="reg-password" className="block text-xs font-medium text-white/50">
          密碼（至少 {PASSWORD_MIN_LENGTH} 字元）
        </label>
        <input
          id="reg-password"
          name="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-brand-neon-purple/50 focus:outline-none focus:ring-1 focus:ring-brand-neon-purple/40"
        />
      </div>
      <div>
        <label
          htmlFor="reg-confirm"
          className="block text-xs font-medium text-white/50"
        >
          確認密碼
        </label>
        <input
          id="reg-confirm"
          name="confirm_password"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="再次輸入密碼"
          className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-brand-neon-purple/50 focus:outline-none focus:ring-1 focus:ring-brand-neon-purple/40"
        />
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/15 px-4 py-3">
        <input
          id="reg-agree"
          name="agree_terms"
          type="checkbox"
          checked={agreeTerms}
          onChange={(e) => setAgreeTerms(e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 rounded border-white/20 bg-black/30 text-brand-purple focus:ring-brand-neon-purple/50"
        />
        <label htmlFor="reg-agree" className="text-sm leading-relaxed text-white/70">
          我已閱讀並同意{" "}
          <Link
            href="/privacy-policy"
            className="text-brand-neon-purple hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            隱私權政策
          </Link>
          與{" "}
          <Link
            href="/terms"
            className="text-brand-neon-purple hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            使用條款
          </Link>
          。
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-gradient-to-r from-brand-purple to-brand-neon-purple py-3 text-sm font-semibold text-white shadow-[0_0_28px_rgba(168,85,247,0.35)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "建立中…" : "建立帳號"}
      </button>

      <p className="text-center text-sm text-white/50">
        已有帳號？{" "}
        <Link
          href={loginHref}
          className="font-medium text-brand-neon-purple hover:underline"
        >
          登入
        </Link>
      </p>
    </form>
  );
}
