import type { HomeSectionRow } from "@/lib/cms/types";

const ORDER = [
  "hero",
  "features",
  "service_intro",
  "popular_venues",
  "featured_coaches",
  "line_intro",
  "testimonials",
  "coming_soon_products",
  "faqs",
  "final_cta",
] as const;

/** DB 無 home_sections 時，仍依規格書順序渲染各區塊（content 走各元件內建 fallback） */
export function buildFallbackHomeSections(): HomeSectionRow[] {
  return ORDER.map((section_key, index) => ({
    id: `fallback-${section_key}`,
    section_key,
    is_enabled: true,
    sort_order: (index + 1) * 10,
    content: {},
    created_at: null,
    updated_at: null,
  }));
}
