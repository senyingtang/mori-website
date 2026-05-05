const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim());
}

/** 註冊：至少 8 字元（高於 Supabase 預設下限，利於安全性） */
export const PASSWORD_MIN_LENGTH = 8;

/** 登入：僅需符合 Supabase 常見下限，避免舊密碼無法登入 */
export const LOGIN_PASSWORD_MIN_LENGTH = 6;

export function isValidPassword(password: string): boolean {
  return password.length >= PASSWORD_MIN_LENGTH;
}

export function isValidLoginPassword(password: string): boolean {
  return password.length >= LOGIN_PASSWORD_MIN_LENGTH;
}
