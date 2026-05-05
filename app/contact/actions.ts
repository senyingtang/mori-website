"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

type ActionResult = { success: true } | { success: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function getString(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === "string" ? v : "";
}

function toNullableTrimmed(v: string): string | null {
  const t = v.trim();
  return t === "" ? null : t;
}

export async function createContactSubmission(formData: FormData): Promise<ActionResult> {
  try {
    const honeypot = getString(formData, "website").trim();
    if (honeypot.length > 0) {
      return { success: true };
    }

    const name = getString(formData, "name").trim();
    const phone = toNullableTrimmed(getString(formData, "phone"));
    const email = toNullableTrimmed(getString(formData, "email"));
    const lineId = toNullableTrimmed(getString(formData, "line_id"));
    const inquiryType = getString(formData, "inquiry_type").trim();
    const subject = toNullableTrimmed(getString(formData, "subject"));
    const message = getString(formData, "message").trim();

    const sourcePath = toNullableTrimmed(getString(formData, "source_path"));
    const sourceType = toNullableTrimmed(getString(formData, "source_type"));
    const sourceIdRaw = toNullableTrimmed(getString(formData, "source_id"));
    const sourceId = sourceIdRaw && UUID_RE.test(sourceIdRaw) ? sourceIdRaw : null;

    const utmSource = toNullableTrimmed(getString(formData, "utm_source"));
    const utmMedium = toNullableTrimmed(getString(formData, "utm_medium"));
    const utmCampaign = toNullableTrimmed(getString(formData, "utm_campaign"));

    if (!name) return { success: false, error: "姓名為必填。" };
    if (!inquiryType) return { success: false, error: "詢問類型為必填。" };
    if (!message) return { success: false, error: "訊息為必填。" };
    if (!email && !phone && !lineId) {
      return { success: false, error: "Email／手機／LINE ID 至少填一個。" };
    }
    if (email && !EMAIL_RE.test(email)) {
      return { success: false, error: "Email 格式不正確。" };
    }

    const startedRaw = getString(formData, "started_at").trim();
    if (startedRaw !== "") {
      const startedMs = Number(startedRaw);
      if (Number.isFinite(startedMs) && startedMs > 0) {
        let nowMs = NaN;
        try {
          nowMs = Date.now();
        } catch {
          nowMs = NaN;
        }
        if (Number.isFinite(nowMs)) {
          const elapsed = nowMs - startedMs;
          if (elapsed >= 0 && elapsed < 3000) {
            return { success: true };
          }
        }
      }
    }

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("contact_submissions").insert({
      name,
      phone,
      email,
      line_id: lineId,
      inquiry_type: inquiryType,
      subject,
      message,
      source_path: sourcePath,
      source_type: sourceType,
      source_id: sourceId,
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch {
    return { success: false, error: "送出失敗，請稍後再試。" };
  }
}

