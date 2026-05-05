import type { SiteSettingsMap } from "@/lib/cms/types";

type BrandJson = {
  site_name?: string;
  slogan?: string;
  tagline?: string;
  logo_url?: string | null;
  /** 全站預設 OG／社群分享圖（無頁面專用 og_image_url 時可沿用） */
  og_image_url?: string | null;
  default_og_image_url?: string | null;
};

export function getBrandFromSettings(map: SiteSettingsMap): {
  siteName: string;
  tagline: string | undefined;
  logoUrl: string | undefined;
} {
  const raw = map.brand;
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { siteName: "森映球團", tagline: undefined, logoUrl: undefined };
  }
  const b = raw as BrandJson;
  const logoRaw = typeof b.logo_url === "string" ? b.logo_url.trim() : "";
  return {
    siteName: b.site_name ?? "森映球團",
    tagline: b.tagline ?? b.slogan,
    logoUrl: logoRaw ? logoRaw : undefined,
  };
}

/** SEO／OG：優先 brand.og_image_url、brand.default_og_image_url，其次 seo.default_og_image_url，最後 logo_url */
export function getDefaultOgImageFromSettings(map: SiteSettingsMap): string | undefined {
  const rawBrand = map.brand;
  if (rawBrand && typeof rawBrand === "object" && !Array.isArray(rawBrand)) {
    const b = rawBrand as BrandJson;
    const fromOg =
      (typeof b.og_image_url === "string" && b.og_image_url.trim()) ||
      (typeof b.default_og_image_url === "string" && b.default_og_image_url.trim());
    if (fromOg) return fromOg.trim();
    const logo = typeof b.logo_url === "string" && b.logo_url.trim() ? b.logo_url.trim() : "";
    if (logo) return logo;
  }

  const rawSeo = map.seo;
  if (rawSeo && typeof rawSeo === "object" && !Array.isArray(rawSeo)) {
    const s = rawSeo as Record<string, unknown>;
    const u = s["default_og_image_url"] ?? s["og_image_url"];
    if (typeof u === "string" && u.trim()) return u.trim();
  }

  return undefined;
}
