import { requireAdminUser } from "@/lib/auth/permissions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SessionsEditor } from "@/components/admin/SessionsEditor";

export const dynamic = "force-dynamic";

export default async function AdminSessionsPage() {
  await requireAdminUser();
  const supabase = await createSupabaseServerClient();

  const [{ data: sessions, error: sErr }, { data: locations, error: lErr }] =
    await Promise.all([
      supabase
        .from("sessions")
        .select("*")
        .order("weekday", { ascending: true })
        .order("start_time", { ascending: true }),
      supabase
        .from("locations")
        .select("id, city, district, name, is_active")
        .order("city", { ascending: true })
        .order("district", { ascending: true })
        .order("name", { ascending: true }),
    ]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 px-6 py-8 shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md">
        <h1 className="text-2xl font-bold text-[#3A2A1E]">場次</h1>
        <p className="mt-2 text-sm text-[#6F5A46]">
          管理{" "}
          <code className="rounded bg-[rgba(214,168,108,0.16)] px-1 text-[#5A3E2B]">
            sessions
          </code>
          ，並
          關聯據點（locations）。
        </p>
        {sErr ? (
          <p className="mt-3 text-sm text-red-900/90">
            sessions 讀取失敗：{sErr.message}
          </p>
        ) : null}
        {lErr ? (
          <p className="mt-1 text-sm text-red-900/90">
            locations 讀取失敗：{lErr.message}
          </p>
        ) : null}
      </div>

      <SessionsEditor
        sessions={(sessions ?? []) as unknown[]}
        locations={(locations ?? []) as unknown[]}
      />
    </div>
  );
}

