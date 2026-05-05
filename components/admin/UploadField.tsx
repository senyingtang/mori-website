"use client";

import { useRef, useState } from "react";
import {
  sanitizeStorageFileName,
  uploadPublicImage,
  type PublicImageBucket,
} from "@/lib/storage/upload";

type Props = {
  label: string;
  value: string;
  bucket: PublicImageBucket;
  /** 不含開頭 /；最終路徑為 pathPrefix + "/" + timestamp + "-" + sanitizedName */
  pathPrefix: string;
  onUploaded: (publicUrl: string) => void;
  accept?: string;
  helperText?: string;
  disabled?: boolean;
};

function previewOk(url: string): boolean {
  if (!url.trim()) return false;
  const lower = url.toLowerCase();
  return (
    lower.endsWith(".png") ||
    lower.endsWith(".jpg") ||
    lower.endsWith(".jpeg") ||
    lower.endsWith(".webp") ||
    lower.endsWith(".svg") ||
    lower.includes("/storage/v1/object/public/")
  );
}

export function UploadField({
  label,
  value,
  bucket,
  pathPrefix,
  onUploaded,
  accept,
  helperText,
  disabled = false,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const defaultAccept =
    bucket === "public-assets"
      ? "image/png,image/jpeg,image/webp,image/svg+xml"
      : "image/png,image/jpeg,image/webp";

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || disabled) return;

    setLocalError(null);
    setUploading(true);
    try {
      const safe = sanitizeStorageFileName(file.name);
      const prefix = pathPrefix.replace(/^\/+|\/+$/g, "");
      const objectPath = `${prefix}/${Date.now()}-${safe}`;

      const res = await uploadPublicImage({ bucket, path: objectPath, file });
      if (!res.success) {
        setLocalError(res.error);
        return;
      }
      onUploaded(res.publicUrl);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "上傳失敗。");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="rounded-xl border border-purple-500/25 bg-black/20 px-4 py-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-white/55">{label}</p>
          {helperText ? (
            <p className="mt-1 text-[11px] text-white/40">{helperText}</p>
          ) : null}
        </div>
        <button
          type="button"
          disabled={disabled || uploading}
          onClick={() => inputRef.current?.click()}
          className="rounded-lg border border-purple-400/35 bg-brand-purple/15 px-3 py-1.5 text-xs font-semibold text-white/90 hover:bg-brand-purple/25 disabled:opacity-50"
        >
          {uploading ? "上傳中…" : "選擇檔案"}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept ?? defaultAccept}
        className="sr-only"
        disabled={disabled || uploading}
        onChange={onPick}
      />

      {value.trim() ? (
        <div className="mt-3 flex flex-wrap items-start gap-3">
          {previewOk(value) ? (
            // eslint-disable-next-line @next/next/no-img-element -- 外部 Supabase URL，避免強制 Image remote 設定
            <img
              src={value}
              alt=""
              className="h-20 w-auto max-w-[120px] rounded-lg border border-white/10 object-contain"
            />
          ) : null}
          <div className="min-w-0 flex-1">
            <p className="break-all text-[11px] text-white/50">目前 URL</p>
            <p className="break-all text-xs text-brand-neon-purple/90">{value}</p>
          </div>
        </div>
      ) : (
        <p className="mt-2 text-[11px] text-white/35">尚未選擇圖片</p>
      )}

      {localError ? (
        <p className="mt-2 text-xs text-red-300/95">{localError}</p>
      ) : null}
    </div>
  );
}
