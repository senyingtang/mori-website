import type { Metadata } from "next";
import { HomeSectionRenderer } from "@/components/home/HomeSectionRenderer";
import { buildFallbackHomeSections } from "@/lib/cms/home-fallback";
import {
  fetchHomeSectionsOrdered,
  fetchPublicSiteSettings,
  fetchSeoSettingsByPageKey,
  getActiveLocations,
  getActiveSessions,
  getActiveSessionsByLocationIds,
  getComingSoonProducts,
  getFaqsByPageKey,
  getFeaturedCoaches,
  getLocationsByIds,
  getMapCitySettings,
} from "@/lib/cms/public-queries";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  buildFaqSchema,
  buildOrganizationSchema,
  buildWebsiteSchema,
  isNonEmptyJsonLd,
} from "@/lib/seo/jsonld";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("home", "/");
}

export default async function HomePage() {
  const [
    siteSettings,
    sectionsRaw,
    locations,
    sessions,
    coaches,
    products,
    faqs,
    mapCities,
    seoRow,
  ] = await Promise.all([
    fetchPublicSiteSettings(),
    fetchHomeSectionsOrdered(),
    getActiveLocations(),
    getActiveSessions(),
    getFeaturedCoaches(),
    getComingSoonProducts(),
    getFaqsByPageKey("home"),
    getMapCitySettings(),
    fetchSeoSettingsByPageKey("home"),
  ]);

  const sections =
    sectionsRaw.length > 0 ? sectionsRaw : buildFallbackHomeSections();

  const mapLocationIds = [
    ...new Set(mapCities.flatMap((c) => c.location_ids ?? [])),
  ];
  const mapLocations = await getLocationsByIds(mapLocationIds);
  const mapSessions = await getActiveSessionsByLocationIds(
    mapLocations.map((l) => l.id)
  );

  const manualSchema = seoRow?.schema_json;
  const autoSchema = [
    buildOrganizationSchema(siteSettings),
    buildWebsiteSchema(siteSettings),
    buildFaqSchema(faqs),
  ].filter(Boolean);
  const schemaToInject = isNonEmptyJsonLd(manualSchema)
    ? manualSchema
    : autoSchema.length > 0
      ? autoSchema
      : null;

  return (
    <div className="pb-12 pt-2 md:pb-16">
      {schemaToInject ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaToInject),
          }}
        />
      ) : null}
      <HomeSectionRenderer
        sections={sections}
        siteSettings={siteSettings}
        locations={locations}
        sessions={sessions}
        coaches={coaches}
        products={products}
        faqs={faqs}
        mapCities={mapCities}
        mapLocations={mapLocations}
        mapSessions={mapSessions}
      />
    </div>
  );
}
