"use client";

import { useState } from "react";

export function FooterBrandLogo({
  logoUrl,
  siteName,
}: {
  logoUrl: string;
  siteName: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;

  return (
    <div className="mb-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logoUrl}
        alt={siteName}
        className="h-8 w-auto max-w-[160px] object-contain object-left"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
