import type { Metadata } from "next";
import type { SessionWithLocation } from "@/types/cms";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  fetchSeoSettingsByPageKey,
  getActiveSessionsWithLocations,
  getFaqsByPageKey,
} from "@/lib/cms/public-queries";
import { SessionsPage } from "@/components/sessions/SessionsPage";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildSessionsItemList,
  isNonEmptyJsonLd,
} from "@/lib/seo/jsonld";
import { getSiteUrl } from "@/lib/env";
import { PublicFAQSection } from "@/components/common/PublicFAQSection";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("sessions", "/sessions");
}

type SearchParams = Record<string, string | string[] | undefined>;

function one(sp: SearchParams, key: string): string | null {
  const v = sp[key];
  if (Array.isArray(v)) return v[0] ?? null;
  return typeof v === "string" ? v : null;
}

export default async function SessionsPublicPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  const locationId = one(sp, "location");
  const city = one(sp, "city");
  const type = one(sp, "type");
  const weekday = one(sp, "weekday");

  const [all, faqs, seoRow] = await Promise.all([
    getActiveSessionsWithLocations(),
    getFaqsByPageKey("sessions"),
    fetchSeoSettingsByPageKey("sessions"),
  ]);

  const initial = all.filter((s) => {
    if (locationId && s.location_id !== locationId) return false;
    if (city && (s.location?.city ?? null) !== city) return false;
    if (type && s.session_type !== type) return false;
    if (weekday && (s.weekday ?? null) !== weekday) return false;
    return true;
  });

  const base = getSiteUrl();
  const manualSchema = seoRow?.schema_json;
  const autoSchema = [
    buildBreadcrumbSchema([
      { name: "首頁", url: base ? `${base}/` : "/" },
      { name: "場次", url: base ? `${base}/sessions` : "/sessions" },
    ]),
    buildSessionsItemList(initial as SessionWithLocation[]),
    buildFaqSchema(faqs),
  ].filter(Boolean);
  const schemaToInject = isNonEmptyJsonLd(manualSchema)
    ? manualSchema
    : autoSchema.length > 0
      ? autoSchema
      : null;

  return (
    <>
      {schemaToInject ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaToInject) }}
        />
      ) : null}
      <SessionsPage
        sessions={initial as SessionWithLocation[]}
        initialFilters={{
          location: locationId ?? "all",
          city: city ?? "all",
          type: type ?? "all",
          weekday: weekday ?? "all",
        }}
      />
      <PublicFAQSection
        title="場次常見問題"
        description="關於臨打準備、程度限制與候補通知。"
        faqs={faqs}
      />
    </>
  );
}

