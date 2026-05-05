import type { SiteSettingsMap } from "@/lib/cms/types";
import { getSiteUrl } from "@/lib/env";
import type { Faq, Location, SessionWithLocation } from "@/types/cms";

type JsonLd = Record<string, unknown> | Record<string, unknown>[];

function brand(map: SiteSettingsMap): {
  name: string;
  logoUrl: string | null;
  sameAs: string[];
} {
  const raw = map.brand;
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { name: "森映球團", logoUrl: null, sameAs: [] };
  }
  const b = raw as { site_name?: string; logo_url?: string | null; same_as?: unknown };
  const sameAs = Array.isArray(b.same_as)
    ? (b.same_as as unknown[]).map((x) => String(x)).filter(Boolean)
    : [];
  return {
    name: b.site_name ?? "森映球團",
    logoUrl: b.logo_url ?? null,
    sameAs,
  };
}

export function buildOrganizationSchema(map: SiteSettingsMap): JsonLd {
  const base = getSiteUrl();
  const b = brand(map);
  return {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    name: b.name,
    url: base ?? undefined,
    logo: b.logoUrl ?? undefined,
    sameAs: b.sameAs.length > 0 ? b.sameAs : undefined,
  };
}

export function buildWebsiteSchema(map: SiteSettingsMap): JsonLd {
  const base = getSiteUrl();
  const b = brand(map);
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: b.name,
    url: base ?? undefined,
  };
}

export function buildFaqSchema(faqs: Faq[]): JsonLd | null {
  if (!faqs || faqs.length === 0) return null;
  const mainEntity = faqs
    .filter((f) => (f.question ?? "").trim() && (f.answer ?? "").trim())
    .map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    }));
  if (mainEntity.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  };
}

export function buildBreadcrumbSchema(
  items: { name: string; url: string }[]
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

export function buildLocationsItemList(locations: Location[]): JsonLd | null {
  if (!locations || locations.length === 0) return null;
  const base = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: locations.map((l, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: l.name,
      url: base ? `${base}/locations?city=${encodeURIComponent(l.city)}` : undefined,
    })),
  };
}

export function buildSessionsItemList(sessions: SessionWithLocation[]): JsonLd | null {
  if (!sessions || sessions.length === 0) return null;
  const base = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: sessions.map((s, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: s.title?.trim() ? s.title : "羽球場次",
      url: base ? `${base}/sessions?location=${encodeURIComponent(s.location_id)}` : undefined,
    })),
  };
}

export function isNonEmptyJsonLd(v: unknown): v is JsonLd {
  if (!v) return false;
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === "object") return Object.keys(v as Record<string, unknown>).length > 0;
  return false;
}

