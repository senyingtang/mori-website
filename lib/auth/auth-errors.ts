/** 將 Supabase Auth 錯誤轉成使用者可讀訊息（不洩漏過多細節） */
export function friendlyAuthMessage(message: string | undefined): string {
  if (!message) return "發生錯誤，請稍後再試。";
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials") || m.includes("invalid_credentials")) {
    return "帳號或密碼不正確，請再確認。";
  }
  if (m.includes("email not confirmed")) {
    return "請先至信箱完成驗證後再登入。";
  }
  if (m.includes("user already registered") || m.includes("already been registered")) {
    return "此 Email 已註冊，請改為登入。";
  }
  if (m.includes("password")) {
    return "密碼不符合要求，請依提示調整。";
  }
  if (m.includes("network") || m.includes("fetch")) {
    return "網路連線異常，請檢查網路後重試。";
  }
  return "無法完成操作，請確認資料後再試。";
}
