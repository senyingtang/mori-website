import { requireAdminUser } from "@/lib/auth/permissions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  ContactSubmissionsTable,
  type ContactSubmissionsFilterState,
} from "@/components/admin/ContactSubmissionsTable";

export const dynamic = "force-dynamic";

type Sp = {
  status?: string | string[];
  inquiry_type?: string | string[];
  q?: string | string[];
  date_from?: string | string[];
  date_to?: string | string[];
};

function first(sp: Sp, key: keyof Sp): string {
  const v = sp[key];
  if (typeof v === "string") return v;
  if (Array.isArray(v)) return v[0] ?? "";
  return "";
}

const STATUSES = new Set(["all", "new", "contacted", "closed", "spam"]);
const INQUIRIES = new Set([
  "all",
  "dropin",
  "teaching",
  "product_notify",
  "venue_partner",
  "brand_partner",
  "system_partner",
  "other",
]);

function normalizeStatus(raw: string): ContactSubmissionsFilterState["status"] {
  const s = raw || "all";
  if (STATUSES.has(s) && s !== "all") {
    return s as ContactSubmissionsFilterState["status"];
  }
  if (s === "all") return "all";
  return "all";
}

function normalizeInquiry(raw: string): string {
  const s = raw || "all";
  if (INQUIRIES.has(s)) return s;
  return "all";
}

function normalizeSearchQ(raw: string): string {
  return raw.trim().replace(/[,()]/g, "").slice(0, 200);
}

function escapeIlikePattern(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");
}

function isYmd(d: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(d);
}

export default async function AdminContactSubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<Sp>;
}) {
  await requireAdminUser();
  const sp = await searchParams;

  const status = normalizeStatus(first(sp, "status"));
  const inquiry_type = normalizeInquiry(first(sp, "inquiry_type"));
  const q = normalizeSearchQ(first(sp, "q"));
  const date_from = first(sp, "date_from").trim();
  const date_to = first(sp, "date_to").trim();

  const filters: ContactSubmissionsFilterState = {
    status,
    inquiry_type,
    q,
    date_from: date_from && isYmd(date_from) ? date_from : "",
    date_to: date_to && isYmd(date_to) ? date_to : "",
  };

  const supabase = await createSupabaseServerClient();

  let qb = supabase.from("contact_submissions").select("*", { count: "exact" });

  if (status !== "all") {
    qb = qb.eq("status", status);
  }
  if (inquiry_type !== "all") {
    qb = qb.eq("inquiry_type", inquiry_type);
  }
  if (filters.date_from) {
    qb = qb.gte("created_at", `${filters.date_from}T00:00:00.000Z`);
  }
  if (filters.date_to) {
    qb = qb.lte("created_at", `${filters.date_to}T23:59:59.999Z`);
  }
  if (q.length > 0) {
    const inner = escapeIlikePattern(q);
    const pat = `%${inner}%`;
    qb = qb.or(
      `name.ilike.${pat},phone.ilike.${pat},email.ilike.${pat},line_id.ilike.${pat},subject.ilike.${pat},message.ilike.${pat}`
    );
  }

  const { data, error, count } = await qb.order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 px-6 py-8 shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md">
        <h1 className="text-2xl font-bold text-[#3A2A1E]">聯絡訊息</h1>
        <p className="mt-2 text-sm text-[#6F5A46]">
          檢視與標記{" "}
          <code className="rounded bg-[rgba(214,168,108,0.16)] px-1 text-[#5A3E2B]">
            contact_submissions
          </code>
          ，目前僅寫入 DB，不寄信、不串報名系統。
        </p>
        {error ? (
          <p className="mt-3 text-sm text-red-900/90">讀取失敗：{error.message}</p>
        ) : null}
      </div>

      <ContactSubmissionsTable
        rows={(data ?? []) as unknown[]}
        totalCount={count ?? 0}
        filters={filters}
      />
    </div>
  );
}
