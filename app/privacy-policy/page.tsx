import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { PolicyProse } from "@/components/policy/PolicyProse";
import {
  fetchSeoSettingsByPageKey,
  getPolicyPage,
} from "@/lib/cms/public-queries";
import { PRIVACY_POLICY_FALLBACK } from "@/lib/cms/policy-fallback";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("privacy_policy", "/privacy-policy");
}

export default async function PrivacyPolicyPage() {
  const [policy, seo] = await Promise.all([
    getPolicyPage("privacy_policy"),
    fetchSeoSettingsByPageKey("privacy_policy"),
  ]);

  const title = policy?.title ?? "隱私權政策";
  const subtitle = seo?.meta_description ?? undefined;
  const body = policy?.content ?? PRIVACY_POLICY_FALLBACK;

  return (
    <div className="pb-16">
      <PageHero title={title} subtitle={subtitle} />
      <article className="mx-auto max-w-4xl rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 px-6 py-10 shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md md:px-10 md:py-12">
        <PolicyProse content={body} />
      </article>
    </div>
  );
}
