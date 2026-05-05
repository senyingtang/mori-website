/**
 * 僅允許站內相對路徑，避免 open redirect。
 * 必須以單一 / 開頭，且不可為 //evil.com
 */
export function safeInternalRedirectPath(
  raw: string | undefined,
  fallback: string
): string {
  if (!raw || typeof raw !== "string") return fallback;
  const t = raw.trim();
  if (!t.startsWith("/") || t.startsWith("//")) return fallback;
  return t;
}
