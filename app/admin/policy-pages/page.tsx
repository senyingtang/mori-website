import { requireAdminUser } from "@/lib/auth/permissions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PolicyPagesEditor } from "@/components/admin/PolicyPagesEditor";

export const dynamic = "force-dynamic";

export default async function AdminPolicyPagesPage() {
  await requireAdminUser();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("policy_pages")
    .select("*")
    .order("page_key", { ascending: true });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-6 py-8 backdrop-blur-md">
        <h1 className="text-2xl font-bold text-white">政策頁</h1>
        <p className="mt-2 text-sm text-white/55">
          管理 <code className="rounded bg-black/30 px-1">policy_pages</code>
          ：隱私權政策與使用條款。
        </p>
        {error ? (
          <p className="mt-3 text-sm text-red-200/90">
            讀取失敗：{error.message}
          </p>
        ) : null}
      </div>

      <PolicyPagesEditor rows={(data ?? []) as unknown[]} />
    </div>
  );
}

