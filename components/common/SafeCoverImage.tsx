"use client";

import { useState } from "react";

type Props = {
  src?: string | null;
  alt: string;
  imgClassName?: string;
  fallback: React.ReactNode;
};

/** 載入失敗時回退到 fallback，避免破版 */
export function SafeCoverImage({ src, alt, imgClassName, fallback }: Props) {
  const [failed, setFailed] = useState(false);
  const trimmed = typeof src === "string" ? src.trim() : "";
  const show = Boolean(trimmed) && !failed;

  if (!show) {
    return <>{fallback}</>;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- 動態外部 URL（Storage／CDN）
    <img
      src={trimmed}
      alt={alt}
      className={imgClassName}
      onError={() => setFailed(true)}
    />
  );
}
