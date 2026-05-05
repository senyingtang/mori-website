import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { fetchSeoSettingsByPageKey, getActiveCoaches, getFaqsByPageKey } from "@/lib/cms/public-queries";
import { CoachesPage } from "@/components/coaches/CoachesPage";
import type { Coach } from "@/types/cms";
import { PublicFAQSection } from "@/components/common/PublicFAQSection";
import { getSiteUrl } from "@/lib/env";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  isNonEmptyJsonLd,
} from "@/lib/seo/jsonld";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("coaches", "/coaches");
}

export const dynamic = "force-dynamic";

const FALLBACK: Coach[] = [
  {
    id: "fallback-0",
    auth_user_id: null,
    name: "教練籌備中",
    avatar_url: null,
    city: "—",
    experience_years: null,
    specialties: ["—"],
    level_tags: ["敬請期待"],
    teaching_styles: null,
    description: "教練資料建置中，歡迎先到聯絡我們洽詢。",
    line_contact_url: null,
    is_featured: false,
    is_main_featured: false,
    sort_order: 0,
    is_active: true,
    created_at: null,
    updated_at: null,
  },
];

export default async function CoachesPublicPage() {
  const [coaches, faqs, seoRow] = await Promise.all([
    getActiveCoaches(),
    getFaqsByPageKey("coaches"),
    fetchSeoSettingsByPageKey("coaches"),
  ]);

  const base = getSiteUrl();
  const manualSchema = seoRow?.schema_json;
  const autoSchema = [
    buildBreadcrumbSchema([
      { name: "首頁", url: base ? `${base}/` : "/" },
      { name: "教練團", url: base ? `${base}/coaches` : "/coaches" },
    ]),
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

      <CoachesPage coaches={coaches.length > 0 ? coaches : FALLBACK} />
      <PublicFAQSection
        title="教練團常見問題"
        description="關於教練課安排、程度分級與諮詢方式。"
        faqs={faqs}
      />
    </>
  );
}
