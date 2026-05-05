import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export type PublicImageBucket = "public-assets" | "coach-avatars" | "product-images";

export type UploadPublicImageResult =
  | { success: true; publicUrl: string; path: string }
  | { success: false; error: string };

const PNG_JPEG_WEBP = new Set(["image/png", "image/jpeg", "image/webp"]);
const SVG = "image/svg+xml";

const MAX_5MB = 5 * 1024 * 1024;
const MAX_8MB = 8 * 1024 * 1024;

function maxBytesForBucket(bucket: PublicImageBucket): number {
  if (bucket === "product-images") return MAX_8MB;
  return MAX_5MB;
}

/**
 * 以瀏覽器端 Supabase（anon + RLS）上傳至 public bucket，回傳 public URL。
 */
export async function uploadPublicImage(params: {
  bucket: PublicImageBucket;
  path: string;
  file: File;
}): Promise<UploadPublicImageResult> {
  const { bucket, path, file } = params;
  const type = file.type;

  if (type === SVG) {
    if (bucket !== "public-assets") {
      return { success: false, error: "SVG 僅允許上傳至 public-assets。" };
    }
  } else if (!PNG_JPEG_WEBP.has(type)) {
    return {
      success: false,
      error: "僅支援 PNG、JPEG、WebP" + (bucket === "public-assets" ? " 或 SVG（限 public-assets）。" : "。"),
    };
  }

  const max = maxBytesForBucket(bucket);
  if (file.size > max) {
    const mb = max / (1024 * 1024);
    return { success: false, error: `檔案不可超過 ${mb}MB。` };
  }

  const normalizedPath = path.replace(/^\/+/, "");

  try {
    const supabase = createSupabaseBrowserClient();
    const { error: upErr } = await supabase.storage
      .from(bucket)
      .upload(normalizedPath, file, { upsert: true, contentType: type || undefined });

    if (upErr) {
      return { success: false, error: upErr.message || "上傳失敗。" };
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(normalizedPath);
    const publicUrl = data?.publicUrl;
    if (!publicUrl) {
      return { success: false, error: "無法取得公開網址。" };
    }

    return { success: true, publicUrl, path: normalizedPath };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "上傳失敗。";
    return { success: false, error: msg };
  }
}

/** 檔名：小寫、空白改 -、移除不安全字元 */
export function sanitizeStorageFileName(name: string): string {
  const base = name.split(/[/\\]/).pop() ?? "image";
  const lower = base.trim().toLowerCase().replace(/\s+/g, "-");
  const safe = lower.replace(/[^a-z0-9._-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return safe.slice(0, 120) || "image";
}
