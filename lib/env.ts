/**
 * 讀取公開環境變數。缺少時回傳 null，呼叫端可決定是否降級（開發／尚未連線 DB）。
 */
export function getSiteUrl(): string | null {
  const v = process.env.NEXT_PUBLIC_SITE_URL;
  return v && v.trim() !== "" ? v.replace(/\/$/, "") : null;
}

export function hasSupabaseConfig(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
