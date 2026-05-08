"use server";

import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/auth/permissions";
import { canManageContent, canManageSiteSettings, canManageUsers } from "@/lib/auth/roles";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ActionResult = { success: true } | { success: false; error: string };
type UserRole = "super_admin" | "admin" | "editor" | "coach" | "member";

function parseJsonOrError(raw: string): { ok: true; value: unknown } | { ok: false; error: string } {
  try {
    return { ok: true, value: JSON.parse(raw) };
  } catch {
    return { ok: false, error: "JSON 格式錯誤，請檢查括號與引號。" };
  }
}

export async function upsertSiteSettings(
  key: string,
  valueJson: string
): Promise<ActionResult> {
  const { profile } = await requireAdminUser();

  if (!canManageSiteSettings(profile?.role)) {
    return {
      success: false,
      error: "你沒有權限修改全站設定，請聯繫管理員。",
    };
  }

  const parsed = parseJsonOrError(valueJson);
  if (!parsed.ok) return { success: false, error: parsed.error };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("site_settings").upsert(
    {
      key,
      value: parsed.value,
      is_public: true,
    },
    { onConflict: "key" }
  );

  if (error) return { success: false, error: error.message };

  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/admin/site-settings");
  return { success: true };
}

export async function updateHomeSection(
  id: string,
  patch: { is_enabled: boolean; sort_order: number; contentJson: string }
): Promise<ActionResult> {
  await requireAdminUser();

  const parsed = parseJsonOrError(patch.contentJson);
  if (!parsed.ok) return { success: false, error: parsed.error };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("home_sections")
    .update({
      is_enabled: patch.is_enabled,
      sort_order: patch.sort_order,
      content: parsed.value,
    })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/home-sections");
  return { success: true };
}

function pageKeyToPath(pageKey: string): string | null {
  switch (pageKey) {
    case "home":
      return "/";
    case "coaches":
      return "/coaches";
    case "products":
      return "/products";
    case "locations":
      return "/locations";
    case "sessions":
      return "/sessions";
    case "login":
      return "/login";
    case "register":
      return "/register";
    case "member_dashboard":
      return "/member-dashboard";
    case "line_binding":
      return "/line-binding";
    case "contact":
      return "/contact";
    case "privacy_policy":
      return "/privacy-policy";
    case "terms":
      return "/terms";
    default:
      return null;
  }
}

export async function updateSeoSettings(
  id: string,
  patch: {
    page_key: string;
    title: string;
    meta_description: string;
    h1: string;
    og_title: string;
    og_description: string;
    og_image_url: string;
    canonical_url: string;
    noindex: boolean;
    schemaJson: string;
  }
): Promise<ActionResult> {
  await requireAdminUser();

  if (!patch.page_key || patch.page_key.trim() === "") {
    return { success: false, error: "page_key 不可空白。" };
  }

  const parsed = parseJsonOrError(patch.schemaJson || "{}");
  if (!parsed.ok) return { success: false, error: parsed.error };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("seo_settings")
    .update({
      page_key: patch.page_key.trim(),
      title: patch.title,
      meta_description: patch.meta_description,
      h1: patch.h1 || null,
      og_title: patch.og_title || null,
      og_description: patch.og_description || null,
      og_image_url: patch.og_image_url || null,
      canonical_url: patch.canonical_url || null,
      noindex: patch.noindex,
      schema_json: parsed.value,
    })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  const path = pageKeyToPath(patch.page_key.trim());
  if (path) revalidatePath(path);
  revalidatePath("/");
  revalidatePath("/admin/seo-settings");
  return { success: true };
}

export async function createSeoSettings(payload: {
  page_key: string;
  title: string;
  meta_description: string;
  h1: string;
  og_title: string;
  og_description: string;
  og_image_url: string;
  canonical_url: string;
  noindex: boolean;
  schema_json: string;
}): Promise<ActionResult> {
  const { profile } = await requireAdminUser();
  if (!canManageContent(profile?.role)) return { success: false, error: "權限不足。" };

  const pageKey = payload.page_key.trim();
  const title = payload.title.trim();
  const metaDesc = payload.meta_description.trim();
  if (!pageKey) return { success: false, error: "page_key 不可空白。" };
  if (!title) return { success: false, error: "title 不可空白。" };
  if (!metaDesc) return { success: false, error: "meta_description 不可空白。" };

  const parsed = parseJsonOrError(payload.schema_json?.trim() ? payload.schema_json : "{}");
  if (!parsed.ok) return { success: false, error: parsed.error };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("seo_settings").insert({
    page_key: pageKey,
    title,
    meta_description: metaDesc,
    h1: payload.h1?.trim() ? payload.h1.trim() : null,
    og_title: payload.og_title?.trim() ? payload.og_title.trim() : null,
    og_description: payload.og_description?.trim() ? payload.og_description.trim() : null,
    og_image_url: payload.og_image_url?.trim() ? payload.og_image_url.trim() : null,
    canonical_url: payload.canonical_url?.trim() ? payload.canonical_url.trim() : null,
    noindex: payload.noindex,
    schema_json: parsed.value,
  });

  if (error) {
    if (isDuplicateKeyErrorMessage(error.message)) {
      return {
        success: false,
        error: "page_key 已存在，請改用編輯既有設定。",
      };
    }
    return { success: false, error: error.message };
  }

  const path = pageKeyToPath(pageKey);
  if (path) revalidatePath(path);
  revalidatePath("/");
  revalidatePath("/admin/seo-settings");
  return { success: true };
}

export async function updatePolicyPage(
  id: string,
  pageKey: string,
  patch: { title: string; content: string }
): Promise<ActionResult> {
  await requireAdminUser();

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("policy_pages")
    .update({
      title: patch.title,
      content: patch.content,
    })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  const path = pageKeyToPath(pageKey);
  if (path) revalidatePath(path);
  revalidatePath("/admin/policy-pages");
  return { success: true };
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function parseUuidList(raw: string): { ok: true; value: string[] } | { ok: false; error: string } {
  const t = raw.trim();
  if (t === "") return { ok: true, value: [] };

  let arr: unknown;
  if (t.startsWith("[")) {
    const parsed = parseJsonOrError(t);
    if (!parsed.ok) return { ok: false, error: parsed.error };
    arr = parsed.value;
  } else {
    arr = t
      .split(/[,\n]/g)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  if (!Array.isArray(arr)) {
    return { ok: false, error: "location_ids 必須是 uuid array（JSON array 或逗號分隔）。" };
  }

  const ids = (arr as unknown[]).map((x) => String(x).trim()).filter(Boolean);
  for (const id of ids) {
    if (!UUID_RE.test(id)) {
      return { ok: false, error: `location_ids 非合法 uuid：${id}` };
    }
  }
  return { ok: true, value: ids };
}

export async function updateMapCitySetting(
  id: string,
  patch: {
    tab_type: "teaching" | "dropin";
    city: string;
    is_enabled: boolean;
    glow_color: string;
    hover_title: string;
    hover_description: string;
    cta_text: string;
    cta_href: string;
    location_ids_raw: string;
    sort_order: number;
  }
): Promise<ActionResult> {
  const { profile } = await requireAdminUser();
  if (!canManageContent(profile?.role)) {
    return { success: false, error: "權限不足。" };
  }

  const city = patch.city.trim();
  if (!city) return { success: false, error: "city 不可空白。" };
  if (!patch.cta_text.trim()) return { success: false, error: "cta_text 不可空白。" };
  if (!patch.cta_href.trim()) return { success: false, error: "cta_href 不可空白。" };

  const locParsed = parseUuidList(patch.location_ids_raw);
  if (!locParsed.ok) return { success: false, error: locParsed.error };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("map_city_settings")
    .update({
      tab_type: patch.tab_type,
      city,
      is_enabled: patch.is_enabled,
      glow_color: patch.glow_color,
      hover_title: patch.hover_title,
      hover_description: patch.hover_description || null,
      cta_text: patch.cta_text,
      cta_href: patch.cta_href,
      location_ids: locParsed.value,
      sort_order: patch.sort_order,
    })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/map-cities");
  return { success: true };
}

function isServiceType(v: string): v is "teaching" | "dropin" | "both" {
  return v === "teaching" || v === "dropin" || v === "both";
}

function isSessionType(v: string): v is "dropin" | "teaching" | "training" {
  return v === "dropin" || v === "teaching" || v === "training";
}

function toNullableString(v: string): string | null {
  const t = v.trim();
  return t === "" ? null : t;
}

function toNullableNumber(v: number | "" | string): number | null {
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  const t = String(v).trim();
  if (t === "") return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function toTextArray(
  v: unknown
): string[] | null {
  if (v == null) return null;
  if (Array.isArray(v)) {
    const arr = v
      .map((x) => String(x).trim())
      .filter(Boolean);
    return arr.length > 0 ? arr : null;
  }
  const t = String(v).trim();
  if (t === "") return null;
  const arr = t
    .split(/[,\n]/g)
    .map((s) => s.trim())
    .filter(Boolean);
  return arr.length > 0 ? arr : null;
}

export async function updateLocation(
  id: string,
  patch: {
    city: string;
    district: string;
    name: string;
    address: string;
    service_type: "teaching" | "dropin" | "both";
    description: string;
    latitude: string;
    longitude: string;
    is_active: boolean;
  }
): Promise<ActionResult> {
  const { profile } = await requireAdminUser();
  if (!canManageContent(profile?.role)) {
    return { success: false, error: "權限不足。" };
  }

  const city = patch.city.trim();
  const name = patch.name.trim();
  if (!city) return { success: false, error: "city 不可空白。" };
  if (!name) return { success: false, error: "name 不可空白。" };
  if (!isServiceType(patch.service_type)) {
    return { success: false, error: "service_type 不合法。" };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("locations")
    .update({
      city,
      district: toNullableString(patch.district),
      name,
      address: toNullableString(patch.address),
      service_type: patch.service_type,
      description: toNullableString(patch.description),
      latitude: toNullableNumber(patch.latitude),
      longitude: toNullableNumber(patch.longitude),
      is_active: patch.is_active,
    })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/locations");
  revalidatePath("/admin/map-cities");
  return { success: true };
}

export async function createLocation(payload: {
  city: string;
  name: string;
  service_type: "teaching" | "dropin" | "both";
}): Promise<ActionResult> {
  const { profile } = await requireAdminUser();
  if (!canManageContent(profile?.role)) {
    return { success: false, error: "權限不足。" };
  }

  const city = payload.city.trim();
  const name = payload.name.trim();
  if (!city) return { success: false, error: "city 不可空白。" };
  if (!name) return { success: false, error: "name 不可空白。" };
  if (!isServiceType(payload.service_type)) {
    return { success: false, error: "service_type 不合法。" };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("locations").insert({
    city,
    name,
    service_type: payload.service_type,
    is_active: true,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/locations");
  revalidatePath("/admin/map-cities");
  return { success: true };
}

export async function updateSession(
  id: string,
  patch: {
    location_id: string;
    title: string;
    session_type: "dropin" | "teaching" | "training";
    weekday: string;
    start_time: string;
    end_time: string;
    level_min: number | "";
    level_max: number | "";
    shuttlecock: string;
    price: string;
    capacity: number | "";
    is_active: boolean;
  }
): Promise<ActionResult> {
  const { profile } = await requireAdminUser();
  if (!canManageContent(profile?.role)) {
    return { success: false, error: "權限不足。" };
  }

  const locationId = patch.location_id.trim();
  if (!locationId) return { success: false, error: "location_id 不可空白。" };
  if (!isSessionType(patch.session_type)) {
    return { success: false, error: "session_type 不合法。" };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("sessions")
    .update({
      location_id: locationId,
      title: toNullableString(patch.title),
      session_type: patch.session_type,
      weekday: toNullableString(patch.weekday),
      start_time: toNullableString(patch.start_time),
      end_time: toNullableString(patch.end_time),
      level_min: toNullableNumber(patch.level_min),
      level_max: toNullableNumber(patch.level_max),
      shuttlecock: toNullableString(patch.shuttlecock),
      price: toNullableNumber(patch.price),
      capacity: toNullableNumber(patch.capacity),
      is_active: patch.is_active,
    })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/sessions");
  return { success: true };
}

export async function createSession(payload: {
  location_id: string;
  session_type: "dropin" | "teaching" | "training";
}): Promise<ActionResult> {
  const { profile } = await requireAdminUser();
  if (!canManageContent(profile?.role)) {
    return { success: false, error: "權限不足。" };
  }

  const locationId = payload.location_id.trim();
  if (!locationId) return { success: false, error: "location_id 不可空白。" };
  if (!isSessionType(payload.session_type)) {
    return { success: false, error: "session_type 不合法。" };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("sessions").insert({
    location_id: locationId,
    session_type: payload.session_type,
    is_active: true,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/sessions");
  return { success: true };
}

export async function updateCoach(
  id: string,
  patch: {
    name: string;
    avatar_url: string;
    city: string;
    experience_years: string;
    specialties: unknown;
    level_tags: unknown;
    teaching_styles: unknown;
    description: string;
    line_contact_url: string;
    is_featured: boolean;
    is_main_featured?: boolean;
    sort_order: number;
    is_active: boolean;
  }
): Promise<ActionResult> {
  const { profile } = await requireAdminUser();
  if (!canManageContent(profile?.role)) {
    return { success: false, error: "權限不足。" };
  }

  const name = patch.name.trim();
  if (!name) return { success: false, error: "name 不可空白。" };

  const supabase = await createSupabaseServerClient();
  const wantsMain = patch.is_main_featured === true;

  if (wantsMain) {
    const { error: clearErr } = await supabase
      .from("coaches")
      .update({ is_main_featured: false })
      .neq("id", id);
    if (clearErr) return { success: false, error: clearErr.message };
  }

  const { error } = await supabase
    .from("coaches")
    .update({
      name,
      avatar_url: toNullableString(patch.avatar_url),
      city: toNullableString(patch.city),
      experience_years: toNullableNumber(patch.experience_years),
      specialties: toTextArray(patch.specialties),
      level_tags: toTextArray(patch.level_tags),
      teaching_styles: toTextArray(patch.teaching_styles),
      description: toNullableString(patch.description),
      line_contact_url: toNullableString(patch.line_contact_url),
      is_featured: wantsMain ? true : patch.is_featured,
      ...(patch.is_main_featured === true || patch.is_main_featured === false
        ? { is_main_featured: patch.is_main_featured }
        : {}),
      sort_order: Number.isFinite(patch.sort_order) ? patch.sort_order : 0,
      is_active: patch.is_active,
    })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/");
  revalidatePath("/coaches");
  revalidatePath("/admin/coaches");
  return { success: true };
}

export async function createCoach(payload: {
  name: string;
  avatar_url?: string;
  is_main_featured?: boolean;
}): Promise<ActionResult> {
  const { profile } = await requireAdminUser();
  if (!canManageContent(profile?.role)) {
    return { success: false, error: "權限不足。" };
  }

  const name = payload.name.trim();
  if (!name) return { success: false, error: "name 不可空白。" };

  const supabase = await createSupabaseServerClient();
  const wantsMain = payload.is_main_featured === true;

  if (wantsMain) {
    const { error: clearErr } = await supabase
      .from("coaches")
      .update({ is_main_featured: false })
      .neq("id", "00000000-0000-0000-0000-000000000000");
    if (clearErr) return { success: false, error: clearErr.message };
  }

  const { error } = await supabase.from("coaches").insert({
    name,
    avatar_url: toNullableString(payload.avatar_url ?? ""),
    is_active: true,
    is_featured: wantsMain ? true : false,
    is_main_featured: wantsMain ? true : false,
    sort_order: 0,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath("/");
  revalidatePath("/coaches");
  revalidatePath("/admin/coaches");
  return { success: true };
}

function isProductStatus(
  v: string
): v is "draft" | "coming_soon" | "active" | "sold_out" {
  return v === "draft" || v === "coming_soon" || v === "active" || v === "sold_out";
}

function isDuplicateKeyErrorMessage(msg: string): boolean {
  const t = msg.toLowerCase();
  return (
    t.includes("duplicate key") ||
    t.includes("unique constraint") ||
    t.includes("already exists")
  );
}

export async function updateProduct(
  id: string,
  patch: {
    name: string;
    slug: string;
    description: string;
    price: string;
    compare_at_price: string;
    image_url: string;
    category_id: string;
    status: "draft" | "coming_soon" | "active" | "sold_out";
    stock_quantity: string;
    is_active: boolean;
    sort_order: number;
  }
): Promise<ActionResult> {
  const { profile } = await requireAdminUser();
  if (!canManageContent(profile?.role)) return { success: false, error: "權限不足。" };

  const name = patch.name.trim();
  const slug = patch.slug.trim();
  if (!name) return { success: false, error: "name 不可空白。" };
  if (!slug) return { success: false, error: "slug 不可空白。" };
  if (!isProductStatus(patch.status)) return { success: false, error: "status 不合法。" };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("products")
    .update({
      name,
      slug,
      description: toNullableString(patch.description),
      price: toNullableNumber(patch.price),
      compare_at_price: toNullableNumber(patch.compare_at_price),
      image_url: toNullableString(patch.image_url),
      category_id: toNullableString(patch.category_id),
      status: patch.status,
      stock_quantity: toNullableNumber(patch.stock_quantity) ?? 0,
      is_active: patch.is_active,
      sort_order: Number.isFinite(patch.sort_order) ? patch.sort_order : 0,
    })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/products");
  return { success: true };
}

export async function createProduct(payload: {
  name: string;
  slug: string;
  status: "draft" | "coming_soon" | "active" | "sold_out";
  image_url?: string;
}): Promise<ActionResult> {
  const { profile } = await requireAdminUser();
  if (!canManageContent(profile?.role)) return { success: false, error: "權限不足。" };

  const name = payload.name.trim();
  const slug = payload.slug.trim();
  if (!name) return { success: false, error: "name 不可空白。" };
  if (!slug) return { success: false, error: "slug 不可空白。" };
  if (!isProductStatus(payload.status)) return { success: false, error: "status 不合法。" };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("products").insert({
    name,
    slug,
    image_url: toNullableString(payload.image_url ?? ""),
    status: payload.status,
    is_active: payload.status !== "draft",
    stock_quantity: 0,
    sort_order: 0,
  });

  if (error) {
    if (isDuplicateKeyErrorMessage(error.message)) {
      return { success: false, error: "slug 已存在，請換一個。" };
    }
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/products");
  return { success: true };
}

export async function updateProductCategory(
  id: string,
  patch: {
    name: string;
    slug: string;
    description: string;
    sort_order: number;
    is_active: boolean;
  }
): Promise<ActionResult> {
  const { profile } = await requireAdminUser();
  if (!canManageContent(profile?.role)) return { success: false, error: "權限不足。" };

  const name = patch.name.trim();
  const slug = patch.slug.trim();
  if (!name) return { success: false, error: "name 不可空白。" };
  if (!slug) return { success: false, error: "slug 不可空白。" };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("product_categories")
    .update({
      name,
      slug,
      description: toNullableString(patch.description),
      sort_order: Number.isFinite(patch.sort_order) ? patch.sort_order : 0,
      is_active: patch.is_active,
    })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/products");
  revalidatePath("/admin/products");
  return { success: true };
}

export async function createProductCategory(payload: {
  name: string;
  slug: string;
}): Promise<ActionResult> {
  const { profile } = await requireAdminUser();
  if (!canManageContent(profile?.role)) return { success: false, error: "權限不足。" };

  const name = payload.name.trim();
  const slug = payload.slug.trim();
  if (!name) return { success: false, error: "name 不可空白。" };
  if (!slug) return { success: false, error: "slug 不可空白。" };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("product_categories").insert({
    name,
    slug,
    sort_order: 0,
    is_active: true,
  });

  if (error) {
    if (isDuplicateKeyErrorMessage(error.message)) {
      return { success: false, error: "slug 已存在，請換一個。" };
    }
    return { success: false, error: error.message };
  }

  revalidatePath("/products");
  revalidatePath("/admin/products");
  return { success: true };
}

export async function updateFaq(
  id: string,
  patch: {
    page_key: string;
    question: string;
    answer: string;
    sort_order: number | "";
    is_active: boolean;
  }
): Promise<ActionResult> {
  const { profile } = await requireAdminUser();
  if (!canManageContent(profile?.role)) return { success: false, error: "權限不足。" };

  const pageKey = patch.page_key.trim();
  const q = patch.question.trim();
  const a = patch.answer.trim();
  if (!pageKey) return { success: false, error: "page_key 不可空白。" };
  if (!q) return { success: false, error: "question 不可空白。" };
  if (!a) return { success: false, error: "answer 不可空白。" };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("faqs")
    .update({
      page_key: pageKey,
      question: q,
      answer: a,
      sort_order: toNullableNumber(patch.sort_order) ?? 0,
      is_active: patch.is_active,
    })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  const path = pageKeyToPath(pageKey);
  if (path) revalidatePath(path);
  revalidatePath("/");
  revalidatePath("/admin/faqs");
  return { success: true };
}

export async function createFaq(payload: {
  page_key: string;
  question: string;
  answer: string;
  sort_order: string;
  is_active: boolean;
}): Promise<ActionResult> {
  const { profile } = await requireAdminUser();
  if (!canManageContent(profile?.role)) return { success: false, error: "權限不足。" };

  const pageKey = payload.page_key.trim();
  const q = payload.question.trim();
  const a = payload.answer.trim();
  if (!pageKey) return { success: false, error: "page_key 不可空白。" };
  if (!q) return { success: false, error: "question 不可空白。" };
  if (!a) return { success: false, error: "answer 不可空白。" };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("faqs").insert({
    page_key: pageKey,
    question: q,
    answer: a,
    sort_order: toNullableNumber(payload.sort_order) ?? 0,
    is_active: payload.is_active,
  });

  if (error) return { success: false, error: error.message };

  const path = pageKeyToPath(pageKey);
  if (path) revalidatePath(path);
  revalidatePath("/");
  revalidatePath("/admin/faqs");
  return { success: true };
}

export async function updateContactSubmission(
  id: string,
  patch: {
    status: "new" | "contacted" | "closed" | "spam";
    admin_note: string;
  }
): Promise<ActionResult> {
  const { profile } = await requireAdminUser();
  if (!canManageContent(profile?.role)) return { success: false, error: "權限不足。" };

  const allowed = new Set(["new", "contacted", "closed", "spam"]);
  if (!allowed.has(patch.status)) {
    return { success: false, error: "status 不合法。" };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("contact_submissions")
    .update({
      status: patch.status,
      admin_note: toNullableString(patch.admin_note),
    })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/contact-submissions");
  return { success: true };
}

export async function updateUserRole(
  userId: string,
  nextRole: UserRole
): Promise<ActionResult> {
  const { profile } = await requireAdminUser();
  if (!canManageUsers(profile?.role)) {
    return { success: false, error: "只有 super_admin 可以調整使用者角色。" };
  }

  const id = userId.trim();
  if (!id || !UUID_RE.test(id)) {
    return { success: false, error: "userId 不合法。" };
  }

  const allowed: UserRole[] = ["super_admin", "admin", "editor", "coach", "member"];
  if (!allowed.includes(nextRole)) {
    return { success: false, error: "role 不合法。" };
  }

  const supabase = await createSupabaseServerClient();

  // Do not allow demoting the last super_admin.
  if (nextRole !== "super_admin") {
    const { data: me, error: meErr } = await supabase
      .from("profiles")
      .select("id, role")
      .eq("id", id)
      .maybeSingle();

    if (meErr) return { success: false, error: meErr.message };

    const currentRole =
      me && typeof me === "object" && me !== null && "role" in me
        ? String((me as Record<string, unknown>).role)
        : null;

    if (currentRole === "super_admin") {
      const { count, error: cErr } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("role", "super_admin");
      if (cErr) return { success: false, error: cErr.message };
      if ((count ?? 0) <= 1) {
        return { success: false, error: "系統需至少保留一位 super_admin，無法降級最後一位。" };
      }
    }
  }

  const { error } = await supabase
    .from("profiles")
    .update({ role: nextRole, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/users");
  return { success: true };
}

