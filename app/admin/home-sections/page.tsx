import { requireAdminUser } from "@/lib/auth/permissions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { HomeSectionsEditor } from "@/components/admin/HomeSectionsEditor";

export const dynamic = "force-dynamic";

export default async function AdminHomeSectionsPage() {
  await requireAdminUser();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("home_sections")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 px-6 py-8 shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md">
        <h1 className="text-2xl font-bold text-[#3A2A1E]">首頁區塊</h1>
        <p className="mt-2 text-sm text-[#6F5A46]">
          管理{" "}
          <code className="rounded bg-[rgba(214,168,108,0.16)] px-1 text-[#5A3E2B]">
            home_sections
          </code>
          ：開關、排序與 content（JSON）。
        </p>
        {error ? (
          <p className="mt-3 text-sm text-red-900/90">
            讀取失敗：{error.message}
          </p>
        ) : null}
      </div>

      <HomeSectionsEditor rows={(data ?? []) as unknown[]} />
    </div>
  );
}

