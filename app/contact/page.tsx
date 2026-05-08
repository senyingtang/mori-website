import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { fetchPublicSiteSettings, getPublicSiteSettings } from "@/lib/cms/public-queries";
import { getBrandFromSettings } from "@/lib/cms/brand";
import { PageHero } from "@/components/layout/PageHero";
import { ContactForm, type ContactInquiryType } from "@/components/contact/ContactForm";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("contact", "/contact");
}

type SearchParams = Record<string, string | string[] | undefined>;

function one(sp: SearchParams, key: string): string | null {
  const v = sp[key];
  if (Array.isArray(v)) return v[0] ?? null;
  return typeof v === "string" ? v : null;
}

function toDefaultType(t: string | null): ContactInquiryType | undefined {
  if (!t) return undefined;
  if (t === "product_notify") return "product_notify";
  if (t === "teaching") return "teaching";
  if (t === "dropin") return "dropin";
  return undefined;
}

export const dynamic = "force-dynamic";

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const type = one(sp, "type");
  const sourceType = one(sp, "source_type") ?? undefined;
  const sourceId = one(sp, "source_id") ?? undefined;
  const utmSource = one(sp, "utm_source") ?? undefined;
  const utmMedium = one(sp, "utm_medium") ?? undefined;
  const utmCampaign = one(sp, "utm_campaign") ?? undefined;

  const [settingsMap, publicSettings] = await Promise.all([
    fetchPublicSiteSettings(),
    getPublicSiteSettings(),
  ]);
  const { siteName } = getBrandFromSettings(settingsMap);
  const { links, contact } = publicSettings;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 md:py-12">
      <PageHero
        title="聯絡我們"
        subtitle="臨打報名、教學諮詢、商品通知、合作提案都歡迎留言；目前不提供線上付款與正式報名。"
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <ContactForm
            defaultInquiryType={toDefaultType(type)}
            source_path="/contact"
            source_type={sourceType}
            source_id={sourceId}
            utm_source={utmSource}
            utm_medium={utmMedium}
            utm_campaign={utmCampaign}
          />
        </div>

        <aside className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 p-6 shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md">
            <h2 className="text-lg font-semibold text-[#3A2A1E]">聯絡方式</h2>
            <p className="mt-2 text-sm text-[#6F5A46]">
              {siteName} 客服／合作洽詢
            </p>
            <div className="mt-4 space-y-2 text-sm text-[#6F5A46]">
              <p>
                <span className="text-[#8B735C]">LINE</span>：
                {links.line_official ? (
                  <a
                    href={links.line_official}
                    className="ml-2 font-semibold text-[#B98552] hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    加入 LINE 官方帳號
                  </a>
                ) : (
                  <span className="ml-2 text-[#9A846E]">尚未設定</span>
                )}
              </p>
              {links.facebook ? (
                <p>
                  <span className="text-[#8B735C]">Facebook</span>：
                  <a
                    href={links.facebook}
                    className="ml-2 font-semibold text-[#B98552] hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Facebook
                  </a>
                </p>
              ) : null}
              {links.instagram ? (
                <p>
                  <span className="text-[#8B735C]">Instagram</span>：
                  <a
                    href={links.instagram}
                    className="ml-2 font-semibold text-[#B98552] hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Instagram
                  </a>
                </p>
              ) : null}
              <p>
                <span className="text-[#8B735C]">Email</span>：
                {contact.email ? (
                  <a
                    href={`mailto:${contact.email}`}
                    className="ml-2 font-semibold text-[#B98552] hover:underline"
                  >
                    {contact.email}
                  </a>
                ) : (
                  <span className="ml-2 text-[#9A846E]">尚未設定</span>
                )}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 p-6 text-sm text-[#6F5A46] shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md">
            <p className="font-semibold text-[#3A2A1E]">小提醒</p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>請至少留下 Email／手機／LINE ID 其中一種聯絡方式。</li>
              <li>若是臨打報名，建議補充程度、可參加時段與地區。</li>
              <li>目前不提供付款／正式報名系統，會以人工方式協助。</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
