import { requireAdminUser } from "@/lib/auth/permissions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CoachesEditor } from "@/components/admin/CoachesEditor";

export const dynamic = "force-dynamic";

export default async function AdminCoachesPage() {
  await requireAdminUser();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("coaches")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-6 py-8 backdrop-blur-md">
        <h1 className="text-2xl font-bold text-white">教練</h1>
        <p className="mt-2 text-sm text-white/55">
          管理 <code className="rounded bg-black/30 px-1">coaches</code>。
          儲存後會同步刷新首頁與教練團頁。
        </p>
        {error ? (
          <p className="mt-3 text-sm text-red-200/90">
            讀取失敗：{error.message}
          </p>
        ) : null}
      </div>

      <CoachesEditor rows={(data ?? []) as unknown[]} />
    </div>
  );
}

