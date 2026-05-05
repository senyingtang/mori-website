import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  fetchSeoSettingsByPageKey,
  getActiveLocationsWithSessions,
  getFaqsByPageKey,
} from "@/lib/cms/public-queries";
import { LocationsPage } from "@/components/locations/LocationsPage";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildLocationsItemList,
  isNonEmptyJsonLd,
} from "@/lib/seo/jsonld";
import { getSiteUrl } from "@/lib/env";
import { PublicFAQSection } from "@/components/common/PublicFAQSection";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("locations", "/locations");
}

export default async function LocationsPublicPage() {
  const [{ locations, sessionsByLocationId }, faqs, seoRow] = await Promise.all([
    getActiveLocationsWithSessions(),
    getFaqsByPageKey("locations"),
    fetchSeoSettingsByPageKey("locations"),
  ]);

  // Map 轉成可序列化結構
  const sessions = Object.fromEntries(
    [...sessionsByLocationId.entries()].map(([k, v]) => [k, v])
  );

  const base = getSiteUrl();
  const manualSchema = seoRow?.schema_json;
  const autoSchema = [
    buildBreadcrumbSchema([
      { name: "首頁", url: base ? `${base}/` : "/" },
      { name: "據點", url: base ? `${base}/locations` : "/locations" },
    ]),
    buildLocationsItemList(locations),
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
      <LocationsPage locations={locations} sessionsByLocationId={sessions} />
      <PublicFAQSection
        title="據點常見問題"
        description="關於據點擴充、合作場館與服務內容。"
        faqs={faqs}
      />
    </>
  );
}

