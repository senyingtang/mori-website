import type { Json } from "@/lib/json";
import { hasSupabaseConfig } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { asRecord, getString } from "@/lib/cms/home-content";
import type {
  HomeSectionRow,
  PolicyPageRow,
  SeoSettingsRow,
  SiteSettingRow,
  SiteSettingsMap,
} from "@/lib/cms/types";
import type {
  Coach,
  Faq,
  Location,
  MapCitySetting,
  MapTabType,
  PublicSiteSettings,
  ProductCategory,
  ProductWithCategory,
  Session,
  SessionWithLocation,
} from "@/types/cms";

/** 僅讀 is_public = true 的 site_settings，組成 key → value map */
export async function fetchPublicSiteSettings(): Promise<SiteSettingsMap> {
  if (!hasSupabaseConfig()) return {};

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("key, value")
    .eq("is_public", true);

  if (error) {
    console.error("[fetchPublicSiteSettings]", error.message);
    return {};
  }

  const map: SiteSettingsMap = {};
  for (const row of (data ?? []) as Pick<SiteSettingRow, "key" | "value">[]) {
    map[row.key] = row.value as Json;
  }
  return map;
}

/** 前台用的 site settings（只取公開且會顯示於 UI 的欄位） */
export async function getPublicSiteSettings(): Promise<PublicSiteSettings> {
  const map = await fetchPublicSiteSettings();
  const brand = asRecord(map["brand"]);
  const links = asRecord(map["links"]);
  const contact = asRecord(map["contact"]);

  return {
    brand: {
      site_name: getString(brand, "site_name"),
      tagline: getString(brand, "tagline"),
      logo_url: getString(brand, "logo_url"),
    },
    links: {
      line_official: getString(links, "line_official"),
      facebook: getString(links, "facebook"),
      instagram: getString(links, "instagram"),
    },
    contact: {
      email: getString(contact, "email"),
    },
  };
}

/** 首頁等區塊：僅 enabled，依 sort_order */
export async function fetchHomeSectionsOrdered(): Promise<HomeSectionRow[]> {
  if (!hasSupabaseConfig()) return [];

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("home_sections")
    .select("*")
    .eq("is_enabled", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[fetchHomeSectionsOrdered]", error.message);
    return [];
  }
  return (data ?? []) as HomeSectionRow[];
}

/** 依 page_key 讀 SEO（匿名可讀 seo_settings 全表之 RLS） */
export async function fetchSeoSettingsByPageKey(
  pageKey: string
): Promise<SeoSettingsRow | null> {
  if (!hasSupabaseConfig()) return null;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("seo_settings")
    .select("*")
    .eq("page_key", pageKey)
    .maybeSingle();

  if (error) {
    console.error("[fetchSeoSettingsByPageKey]", error.message);
    return null;
  }
  return data as SeoSettingsRow | null;
}

/** 啟用中的據點，依城市、區域、建立時間 */
export async function getActiveLocations(): Promise<Location[]> {
  if (!hasSupabaseConfig()) return [];

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .eq("is_active", true)
    .order("city", { ascending: true })
    .order("district", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[getActiveLocations]", error.message);
    return [];
  }
  return (data ?? []).map((row) =>
    mapLocationRow(row as Record<string, unknown>)
  );
}

function mapSessionRow(s: Record<string, unknown>): Session {
  return {
    id: String(s.id),
    location_id: String(s.location_id),
    title: s.title != null ? String(s.title) : null,
    session_type: s.session_type as Session["session_type"],
    weekday: s.weekday != null ? String(s.weekday) : null,
    start_time: s.start_time != null ? String(s.start_time) : null,
    end_time: s.end_time != null ? String(s.end_time) : null,
    level_min:
      typeof s.level_min === "number" ? s.level_min : s.level_min != null ? Number(s.level_min) : null,
    level_max:
      typeof s.level_max === "number" ? s.level_max : s.level_max != null ? Number(s.level_max) : null,
    shuttlecock: s.shuttlecock != null ? String(s.shuttlecock) : null,
    price:
      s.price != null && s.price !== ""
        ? String(s.price)
        : null,
    capacity:
      typeof s.capacity === "number" ? s.capacity : s.capacity != null ? Number(s.capacity) : null,
    is_active: Boolean(s.is_active),
    created_at: s.created_at != null ? String(s.created_at) : null,
    updated_at: s.updated_at != null ? String(s.updated_at) : null,
  };
}

function mapLocationRow(l: Record<string, unknown>): Location {
  return {
    id: String(l.id),
    city: String(l.city),
    district: l.district != null ? String(l.district) : null,
    name: String(l.name),
    address: l.address != null ? String(l.address) : null,
    service_type: l.service_type as Location["service_type"],
    description: l.description != null ? String(l.description) : null,
    latitude: l.latitude != null ? String(l.latitude) : null,
    longitude: l.longitude != null ? String(l.longitude) : null,
    is_active: Boolean(l.is_active),
    created_at: l.created_at != null ? String(l.created_at) : null,
    updated_at: l.updated_at != null ? String(l.updated_at) : null,
  };
}

function mapCoachRow(c: Record<string, unknown>): Coach {
  return {
    id: String(c.id),
    auth_user_id: c.auth_user_id != null ? String(c.auth_user_id) : null,
    name: String(c.name),
    avatar_url: c.avatar_url != null ? String(c.avatar_url) : null,
    city: c.city != null ? String(c.city) : null,
    experience_years:
      typeof c.experience_years === "number"
        ? c.experience_years
        : c.experience_years != null
          ? Number(c.experience_years)
          : null,
    specialties: Array.isArray(c.specialties)
      ? (c.specialties as unknown[]).map((x) => String(x))
      : null,
    level_tags: Array.isArray(c.level_tags)
      ? (c.level_tags as unknown[]).map((x) => String(x))
      : null,
    teaching_styles: Array.isArray(c.teaching_styles)
      ? (c.teaching_styles as unknown[]).map((x) => String(x))
      : null,
    description: c.description != null ? String(c.description) : null,
    line_contact_url:
      c.line_contact_url != null ? String(c.line_contact_url) : null,
    is_featured: Boolean(c.is_featured),
    is_main_featured: Boolean((c as Record<string, unknown>).is_main_featured),
    sort_order:
      typeof c.sort_order === "number" ? c.sort_order : Number(c.sort_order),
    is_active: Boolean(c.is_active),
    created_at: c.created_at != null ? String(c.created_at) : null,
    updated_at: c.updated_at != null ? String(c.updated_at) : null,
  };
}

export async function getActiveCoaches(): Promise<Coach[]> {
  if (!hasSupabaseConfig()) return [];

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("coaches")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[getActiveCoaches]", error.message);
    return [];
  }
  return ((data ?? []) as Record<string, unknown>[]).map(mapCoachRow);
}

/**
 * 啟用中的場次，並帶入據點（分兩段查詢，避免 join 型別與關聯名稱差異）
 */
export async function getActiveSessions(): Promise<SessionWithLocation[]> {
  if (!hasSupabaseConfig()) return [];

  const supabase = await createSupabaseServerClient();
  const { data: rawSessions, error: sErr } = await supabase
    .from("sessions")
    .select("*")
    .eq("is_active", true)
    .order("weekday", { ascending: true })
    .order("start_time", { ascending: true });

  if (sErr) {
    console.error("[getActiveSessions] sessions", sErr.message);
    return [];
  }

  const sessions = (rawSessions ?? []) as Record<string, unknown>[];
  if (sessions.length === 0) return [];

  const locIds = [
    ...new Set(sessions.map((s) => String(s.location_id))),
  ];
  const { data: rawLocs, error: lErr } = await supabase
    .from("locations")
    .select("*")
    .in("id", locIds)
    .eq("is_active", true);

  if (lErr) {
    console.error("[getActiveSessions] locations", lErr.message);
  }

  const locMap = new Map<string, Location>();
  for (const l of (rawLocs ?? []) as Record<string, unknown>[]) {
    const loc = mapLocationRow(l);
    locMap.set(loc.id, loc);
  }

  return sessions.map((s) => {
    const row = mapSessionRow(s);
    return {
      ...row,
      location: locMap.get(row.location_id) ?? null,
    };
  });
}

export async function getActiveLocationsWithSessions(): Promise<{
  locations: Location[];
  sessionsByLocationId: Map<string, Session[]>;
}> {
  if (!hasSupabaseConfig()) {
    return { locations: [], sessionsByLocationId: new Map() };
  }

  const supabase = await createSupabaseServerClient();
  const [{ data: rawLocs, error: lErr }, { data: rawSessions, error: sErr }] =
    await Promise.all([
      supabase
        .from("locations")
        .select("*")
        .eq("is_active", true)
        .order("city", { ascending: true })
        .order("district", { ascending: true })
        .order("created_at", { ascending: true }),
      supabase
        .from("sessions")
        .select("*")
        .eq("is_active", true)
        .order("weekday", { ascending: true })
        .order("start_time", { ascending: true }),
    ]);

  if (lErr) {
    console.error("[getActiveLocationsWithSessions] locations", lErr.message);
  }
  if (sErr) {
    console.error("[getActiveLocationsWithSessions] sessions", sErr.message);
  }

  const locations = (rawLocs ?? []).map((row) =>
    mapLocationRow(row as Record<string, unknown>)
  );
  const sessions = (rawSessions ?? []).map((row) =>
    mapSessionRow(row as Record<string, unknown>)
  );

  const sessionsByLocationId = new Map<string, Session[]>();
  for (const s of sessions) {
    const arr = sessionsByLocationId.get(s.location_id) ?? [];
    arr.push(s);
    sessionsByLocationId.set(s.location_id, arr);
  }

  return { locations, sessionsByLocationId };
}

export async function getActiveSessionsWithLocations(): Promise<
  SessionWithLocation[]
> {
  return getActiveSessions();
}

/**
 * 精選教練；若無 is_featured，改取 is_active 前 3 筆
 */
export async function getFeaturedCoaches(): Promise<Coach[]> {
  if (!hasSupabaseConfig()) return [];

  const supabase = await createSupabaseServerClient();
  const selectWithMain =
    "id,auth_user_id,name,avatar_url,city,experience_years,specialties,level_tags,teaching_styles,description,line_contact_url,is_featured,is_main_featured,sort_order,is_active,created_at,updated_at";

  // Prefer main-featured + featured, and keep stable ordering.
  // If the DB hasn't applied migration 005 yet, selecting `is_main_featured`
  // will error; we fall back to selecting without that column.
  const { data: rows, error } = await supabase
    .from("coaches")
    .select(selectWithMain)
    .eq("is_active", true)
    .order("is_main_featured", { ascending: false })
    .order("is_featured", { ascending: false })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[getFeaturedCoaches] coaches", error.message);

    const { data: fallbackRows, error: fbErr } = await supabase
      .from("coaches")
      .select("*")
      .eq("is_active", true)
      .order("is_featured", { ascending: false })
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (fbErr) {
      console.error("[getFeaturedCoaches] fallback", fbErr.message);
      return [];
    }
    return ((fallbackRows ?? []) as Record<string, unknown>[]).map((r) => ({
      ...mapCoachRow(r),
      is_main_featured: false,
    }));
  }

  return ((rows ?? []) as Record<string, unknown>[]).map(mapCoachRow);
}

/**
 * Coming soon 或已上架候選；依 sort_order，最多 6 筆，帶分類
 */
export async function getComingSoonProducts(): Promise<ProductWithCategory[]> {
  if (!hasSupabaseConfig()) return [];

  const supabase = await createSupabaseServerClient();
  const { data: products, error: pErr } = await supabase
    .from("products")
    .select(
      `
      id,
      name,
      slug,
      description,
      price,
      compare_at_price,
      image_url,
      category_id,
      status,
      stock_quantity,
      is_active,
      sort_order,
      created_at,
      updated_at
    `
    )
    .or("status.eq.coming_soon,is_active.eq.true")
    .order("sort_order", { ascending: true })
    .limit(6);

  if (pErr) {
    console.error("[getComingSoonProducts]", pErr.message);
    return [];
  }

  const rows = (products ?? []) as Record<string, unknown>[];
  if (rows.length === 0) return [];

  const catIds = [
    ...new Set(
      rows
        .map((r) => r.category_id)
        .filter((x): x is string => typeof x === "string")
    ),
  ];

  const catMap = new Map<string, ProductWithCategory["category"]>();
  if (catIds.length > 0) {
    const { data: cats, error: cErr } = await supabase
      .from("product_categories")
      .select("*")
      .in("id", catIds)
      .eq("is_active", true);

    if (cErr) console.error("[getComingSoonProducts] categories", cErr.message);
    for (const c of (cats ?? []) as Record<string, unknown>[]) {
      catMap.set(String(c.id), {
        id: String(c.id),
        name: String(c.name),
        slug: String(c.slug),
        description: c.description != null ? String(c.description) : null,
        sort_order: Number(c.sort_order),
        is_active: Boolean(c.is_active),
        created_at: c.created_at != null ? String(c.created_at) : null,
        updated_at: c.updated_at != null ? String(c.updated_at) : null,
      });
    }
  }

  return rows.map((r) => {
    const categoryId =
      r.category_id != null && typeof r.category_id === "string"
        ? r.category_id
        : r.category_id != null
          ? String(r.category_id)
          : null;
    return {
      id: String(r.id),
      name: String(r.name),
      slug: String(r.slug),
      description: r.description != null ? String(r.description) : null,
      price: r.price != null && r.price !== "" ? String(r.price) : null,
      compare_at_price:
        r.compare_at_price != null && r.compare_at_price !== ""
          ? String(r.compare_at_price)
          : null,
      image_url: r.image_url != null ? String(r.image_url) : null,
      category_id: categoryId,
      status: r.status as ProductWithCategory["status"],
      stock_quantity: Number(r.stock_quantity),
      is_active: Boolean(r.is_active),
      sort_order: Number(r.sort_order),
      created_at: r.created_at != null ? String(r.created_at) : null,
      updated_at: r.updated_at != null ? String(r.updated_at) : null,
      category: categoryId ? catMap.get(categoryId) ?? null : null,
    };
  });
}

export async function getActiveProductCategories(): Promise<ProductCategory[]> {
  if (!hasSupabaseConfig()) return [];
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("product_categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[getActiveProductCategories]", error.message);
    return [];
  }

  return ((data ?? []) as Record<string, unknown>[]).map((c) => ({
    id: String(c.id),
    name: String(c.name),
    slug: String(c.slug),
    description: c.description != null ? String(c.description) : null,
    sort_order: Number(c.sort_order),
    is_active: Boolean(c.is_active),
    created_at: c.created_at != null ? String(c.created_at) : null,
    updated_at: c.updated_at != null ? String(c.updated_at) : null,
  }));
}

export async function getPublicProducts(): Promise<ProductWithCategory[]> {
  if (!hasSupabaseConfig()) return [];

  const supabase = await createSupabaseServerClient();
  const { data: products, error: pErr } = await supabase
    .from("products")
    .select("*")
    .or("is_active.eq.true,status.eq.coming_soon")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (pErr) {
    console.error("[getPublicProducts] products", pErr.message);
    return [];
  }

  const rows = (products ?? []) as Record<string, unknown>[];
  if (rows.length === 0) return [];

  const catIds = [
    ...new Set(
      rows
        .map((r) => r.category_id)
        .filter((x): x is string => typeof x === "string")
    ),
  ];

  const catMap = new Map<string, ProductWithCategory["category"]>();
  if (catIds.length > 0) {
    const { data: cats, error: cErr } = await supabase
      .from("product_categories")
      .select("*")
      .in("id", catIds);
    if (cErr) console.error("[getPublicProducts] categories", cErr.message);
    for (const c of (cats ?? []) as Record<string, unknown>[]) {
      catMap.set(String(c.id), {
        id: String(c.id),
        name: String(c.name),
        slug: String(c.slug),
        description: c.description != null ? String(c.description) : null,
        sort_order: Number(c.sort_order),
        is_active: Boolean(c.is_active),
        created_at: c.created_at != null ? String(c.created_at) : null,
        updated_at: c.updated_at != null ? String(c.updated_at) : null,
      });
    }
  }

  return rows.map((r) => {
    const categoryId =
      r.category_id != null && typeof r.category_id === "string"
        ? r.category_id
        : r.category_id != null
          ? String(r.category_id)
          : null;
    return {
      id: String(r.id),
      name: String(r.name),
      slug: String(r.slug),
      description: r.description != null ? String(r.description) : null,
      price: r.price != null && r.price !== "" ? String(r.price) : null,
      compare_at_price:
        r.compare_at_price != null && r.compare_at_price !== ""
          ? String(r.compare_at_price)
          : null,
      image_url: r.image_url != null ? String(r.image_url) : null,
      category_id: categoryId,
      status: r.status as ProductWithCategory["status"],
      stock_quantity: Number(r.stock_quantity),
      is_active: Boolean(r.is_active),
      sort_order: Number(r.sort_order),
      created_at: r.created_at != null ? String(r.created_at) : null,
      updated_at: r.updated_at != null ? String(r.updated_at) : null,
      category: categoryId ? catMap.get(categoryId) ?? null : null,
    };
  });
}

export async function getFaqsByPageKey(pageKey: string): Promise<Faq[]> {
  if (!hasSupabaseConfig()) return [];

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .eq("page_key", pageKey)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[getFaqsByPageKey]", error.message);
    return [];
  }
  return (data ?? []) as unknown as Faq[];
}

function mapCitySettingRow(r: Record<string, unknown>): MapCitySetting {
  const rawIds = r.location_ids;
  const ids: string[] = Array.isArray(rawIds)
    ? rawIds.map((x) => String(x))
    : [];
  return {
    id: String(r.id),
    tab_type: r.tab_type as MapTabType,
    city: String(r.city),
    is_enabled: Boolean(r.is_enabled),
    glow_color: String(r.glow_color),
    hover_title: String(r.hover_title),
    hover_description:
      r.hover_description != null ? String(r.hover_description) : null,
    cta_text: String(r.cta_text),
    cta_href: String(r.cta_href),
    location_ids: ids,
    sort_order: Number(r.sort_order),
    created_at: r.created_at != null ? String(r.created_at) : null,
    updated_at: r.updated_at != null ? String(r.updated_at) : null,
  };
}

export async function getMapCitySettings(
  tabType?: MapTabType
): Promise<MapCitySetting[]> {
  if (!hasSupabaseConfig()) return [];

  const supabase = await createSupabaseServerClient();
  let q = supabase
    .from("map_city_settings")
    .select("*")
    .eq("is_enabled", true)
    .order("sort_order", { ascending: true });

  if (tabType) {
    q = q.eq("tab_type", tabType);
  }

  const { data, error } = await q;
  if (error) {
    console.error("[getMapCitySettings]", error.message);
    return [];
  }
  return ((data ?? []) as Record<string, unknown>[]).map(mapCitySettingRow);
}

export async function getLocationsByIds(ids: string[]): Promise<Location[]> {
  if (!hasSupabaseConfig()) return [];
  const uniq = [...new Set(ids)].filter(Boolean);
  if (uniq.length === 0) return [];

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .in("id", uniq)
    .eq("is_active", true);

  if (error) {
    console.error("[getLocationsByIds]", error.message);
    return [];
  }
  return (data ?? []).map((row) =>
    mapLocationRow(row as Record<string, unknown>)
  );
}

export async function getActiveSessionsByLocationIds(
  locationIds: string[]
): Promise<Session[]> {
  if (!hasSupabaseConfig()) return [];
  const uniq = [...new Set(locationIds)].filter(Boolean);
  if (uniq.length === 0) return [];

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .in("location_id", uniq)
    .eq("is_active", true)
    .order("weekday", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) {
    console.error("[getActiveSessionsByLocationIds]", error.message);
    return [];
  }
  return ((data ?? []) as Record<string, unknown>[]).map(mapSessionRow);
}

/** 政策頁：privacy_policy / terms（公開 RLS 可讀） */
export async function getPolicyPage(
  pageKey: "privacy_policy" | "terms"
): Promise<PolicyPageRow | null> {
  if (!hasSupabaseConfig()) return null;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("policy_pages")
    .select("page_key, title, content")
    .eq("page_key", pageKey)
    .maybeSingle();

  if (error) {
    console.error("[getPolicyPage]", pageKey, error.message);
    return null;
  }
  if (!data) return null;

  const row = data as Record<string, unknown>;
  return {
    page_key: String(row.page_key),
    title: String(row.title),
    content: String(row.content),
  };
}
