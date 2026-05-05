import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { PolicyProse } from "@/components/policy/PolicyProse";
import {
  fetchSeoSettingsByPageKey,
  getPolicyPage,
} from "@/lib/cms/public-queries";
import { TERMS_FALLBACK } from "@/lib/cms/policy-fallback";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("terms", "/terms");
}

export default async function TermsPage() {
  const [policy, seo] = await Promise.all([
    getPolicyPage("terms"),
    fetchSeoSettingsByPageKey("terms"),
  ]);

  const title = policy?.title ?? "使用條款";
  const subtitle = seo?.meta_description ?? undefined;
  const body = policy?.content ?? TERMS_FALLBACK;

  return (
    <div className="pb-16">
      <PageHero title={title} subtitle={subtitle} />
      <article className="mx-auto max-w-4xl rounded-2xl border border-[rgba(255,255,255,0.10)] bg-white/[0.06] px-6 py-10 shadow-[0_0_40px_rgba(31,20,16,0.12)] backdrop-blur-md md:px-10 md:py-12">
        <PolicyProse content={body} />
      </article>
    </div>
  );
}
