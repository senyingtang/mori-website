import { requireAdminUser } from "@/lib/auth/permissions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SiteSettingsEditor } from "@/components/admin/SiteSettingsEditor";

export const dynamic = "force-dynamic";

export default async function AdminSiteSettingsPage() {
  const { profile } = await requireAdminUser();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("site_settings")
    .select("key, value, is_public, updated_at")
    .order("key", { ascending: true });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-6 py-8 backdrop-blur-md">
        <h1 className="text-2xl font-bold text-white">全站設定</h1>
        <p className="mt-2 text-sm text-white/55">
          管理 <code className="rounded bg-black/30 px-1">site_settings</code>{" "}
         （jsonb）。儲存後會 revalidate 首頁。
        </p>
        {error ? (
          <p className="mt-3 text-sm text-red-200/90">
            讀取失敗：{error.message}
          </p>
        ) : null}
      </div>

      <SiteSettingsEditor
        rows={(data ?? []) as unknown[]}
        role={profile?.role ?? null}
      />
    </div>
  );
}

