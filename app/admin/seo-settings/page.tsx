import { requireAdminUser } from "@/lib/auth/permissions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SeoSettingsEditor } from "@/components/admin/SeoSettingsEditor";

export const dynamic = "force-dynamic";

const COMMON_PAGE_KEYS = [
  "home",
  "coaches",
  "products",
  "locations",
  "sessions",
  "contact",
  "privacy_policy",
  "terms",
  "login",
  "register",
  "member_dashboard",
  "line_binding",
] as const;

export default async function AdminSeoSettingsPage() {
  await requireAdminUser();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("seo_settings")
    .select("*")
    .order("page_key", { ascending: true });

  const existing = new Set(
    ((data ?? []) as { page_key?: string | null }[])
      .map((r) => (r.page_key ?? "").trim())
      .filter(Boolean)
  );
  const missingKeys = COMMON_PAGE_KEYS.filter((k) => !existing.has(k));

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 px-6 py-8 shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md">
        <h1 className="text-2xl font-bold text-[#3A2A1E]">SEO 設定</h1>
        <p className="mt-2 text-sm text-[#6F5A46]">
          管理{" "}
          <code className="rounded bg-[rgba(214,168,108,0.16)] px-1 text-[#5A3E2B]">
            seo_settings
          </code>
          ：儲存後會 revalidate 對應頁面（或至少首頁）。
        </p>
        {error ? (
          <p className="mt-3 text-sm text-red-900/90">
            讀取失敗：{error.message}
          </p>
        ) : null}
      </div>

      <SeoSettingsEditor rows={(data ?? []) as unknown[]} missingKeys={missingKeys} />
    </div>
  );
}

