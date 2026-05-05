import type { Json } from "@/lib/json";

/** site_settings 單筆 */
export type SiteSettingRow = {
  key: string;
  value: Json;
  is_public: boolean;
  updated_at: string | null;
};

/** home_sections 單筆 */
export type HomeSectionRow = {
  id: string;
  section_key: string;
  is_enabled: boolean;
  sort_order: number;
  content: Json;
  created_at: string | null;
  updated_at: string | null;
};

/** seo_settings 單筆 */
export type SeoSettingsRow = {
  id: string;
  page_key: string;
  title: string;
  meta_description: string;
  h1: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image_url: string | null;
  canonical_url: string | null;
  schema_json: Json;
  noindex: boolean;
  created_at: string | null;
  updated_at: string | null;
};

export type SiteSettingsMap = Record<string, Json>;

/** policy_pages 單筆（前台 policy 頁用） */
export type PolicyPageRow = {
  page_key: string;
  title: string;
  content: string;
};
