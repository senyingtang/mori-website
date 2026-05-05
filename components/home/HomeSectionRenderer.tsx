import type { HomeSectionRow, SiteSettingsMap } from "@/lib/cms/types";
import type {
  Coach,
  Faq,
  Location,
  MapCitySetting,
  ProductWithCategory,
  Session,
  SessionWithLocation,
} from "@/types/cms";
import { BrandFeatureCards } from "@/components/home/BrandFeatureCards";
import { ComingSoonProducts } from "@/components/home/ComingSoonProducts";
import { FAQSection } from "@/components/home/FAQSection";
import { FeaturedCoaches } from "@/components/home/FeaturedCoaches";
import { FinalCTA } from "@/components/home/FinalCTA";
import { HeroSection } from "@/components/home/HeroSection";
import { LineSystemIntro } from "@/components/home/LineSystemIntro";
import { PopularVenues } from "@/components/home/PopularVenues";
import { ServiceIntroCards } from "@/components/home/ServiceIntroCards";
import { TestimonialsCarousel } from "@/components/home/TestimonialsCarousel";

export type HomeSectionRendererProps = {
  sections: HomeSectionRow[];
  siteSettings: SiteSettingsMap;
  locations: Location[];
  sessions: SessionWithLocation[];
  coaches: Coach[];
  products: ProductWithCategory[];
  faqs: Faq[];
  mapCities: MapCitySetting[];
  mapLocations: Location[];
  mapSessions: Session[];
};

export function HomeSectionRenderer({
  sections,
  siteSettings,
  locations,
  sessions,
  coaches,
  products,
  faqs,
  mapCities,
  mapLocations,
  mapSessions,
}: HomeSectionRendererProps) {
  const ordered = [...sections]
    .filter((s) => s.is_enabled)
    .sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="flex flex-col gap-16 md:gap-24 lg:gap-28">
      {ordered.map((section) => {
        switch (section.section_key) {
          case "hero":
            return (
              <HeroSection
                key={section.id}
                section={section}
                siteSettings={siteSettings}
                mapCities={mapCities}
                mapLocations={mapLocations}
                mapSessions={mapSessions}
              />
            );
          case "features":
            return <BrandFeatureCards key={section.id} section={section} />;
          case "service_intro":
            return <ServiceIntroCards key={section.id} section={section} />;
          case "popular_venues":
            return (
              <PopularVenues
                key={section.id}
                section={section}
                locations={locations}
                sessions={sessions}
              />
            );
          case "featured_coaches":
            return (
              <FeaturedCoaches
                key={section.id}
                section={section}
                coaches={coaches}
              />
            );
          case "line_intro":
            return <LineSystemIntro key={section.id} section={section} />;
          case "testimonials":
            return (
              <TestimonialsCarousel key={section.id} section={section} />
            );
          case "coming_soon_products":
            return (
              <ComingSoonProducts
                key={section.id}
                section={section}
                products={products}
              />
            );
          case "faqs":
            return (
              <FAQSection key={section.id} section={section} faqs={faqs} />
            );
          case "final_cta":
            return <FinalCTA key={section.id} section={section} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
