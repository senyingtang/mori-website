"use client";

import { useMemo, useState, useTransition } from "react";
import { upsertSiteSettings } from "@/app/admin/actions";
import { asRecord } from "@/lib/cms/home-content";
import { canManageSiteSettings } from "@/lib/auth/roles";
import { UploadField } from "@/components/admin/UploadField";

type Row = {
  key: string;
  value: unknown;
};

function pretty(v: unknown): string {
  try {
    return JSON.stringify(v ?? {}, null, 2);
  } catch {
    return "{}";
  }
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#8B735C]">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="mt-1 w-full rounded-xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.78)] px-4 py-2.5 text-sm text-[#3A2A1E] placeholder:text-[#8B735C] outline-none focus:border-[rgba(185,133,82,0.35)] focus:ring-1 focus:ring-[rgba(185,133,82,0.18)] disabled:opacity-60"
      />
    </div>
  );
}

function isRow(x: unknown): x is Row {
  if (!x || typeof x !== "object") return false;
  const r = x as Record<string, unknown>;
  return typeof r.key === "string";
}

export function SiteSettingsEditor({
  rows,
  role,
}: {
  rows: unknown[];
  role: string | null;
}) {
  const map = useMemo(() => {
    const m = new Map<string, unknown>();
    for (const r of rows.filter(isRow)) m.set(r.key, (r as Row).value);
    return m;
  }, [rows]);

  const canEdit = canManageSiteSettings(role);

  const brand = asRecord(map.get("brand"));
  const links = asRecord(map.get("links"));
  const contact = asRecord(map.get("contact"));
  const theme = asRecord(map.get("theme"));

  const [brandSiteName, setBrandSiteName] = useState(
    (brand?.["site_name"] as string | undefined) ?? ""
  );
  const [brandTagline, setBrandTagline] = useState(
    (brand?.["tagline"] as string | undefined) ??
      (brand?.["slogan"] as string | undefined) ??
      ""
  );
  const [brandLogoUrl, setBrandLogoUrl] = useState(
    (brand?.["logo_url"] as string | undefined) ?? ""
  );

  const [linksLine, setLinksLine] = useState(
    (links?.["line_official"] as string | undefined) ?? ""
  );
  const [linksFb, setLinksFb] = useState(
    (links?.["facebook"] as string | undefined) ?? ""
  );
  const [linksIg, setLinksIg] = useState(
    (links?.["instagram"] as string | undefined) ?? ""
  );

  const [contactEmail, setContactEmail] = useState(
    (contact?.["email"] as string | undefined) ??
      (contact?.["support_email"] as string | undefined) ??
      ""
  );

  const [themePrimary, setThemePrimary] = useState(
    (theme?.["primary_purple"] as string | undefined) ?? ""
  );
  const [themeDeep, setThemeDeep] = useState(
    (theme?.["deep_purple"] as string | undefined) ?? ""
  );
  const [themeNeon, setThemeNeon] = useState(
    (theme?.["neon_purple"] as string | undefined) ?? ""
  );
  const [themeBlue, setThemeBlue] = useState(
    (theme?.["electric_blue"] as string | undefined) ?? ""
  );
  const [themeRed, setThemeRed] = useState(
    (theme?.["energy_red"] as string | undefined) ?? ""
  );

  const [status, setStatus] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function save(key: string, obj: unknown) {
    setStatus(null);
    startTransition(async () => {
      const res = await upsertSiteSettings(key, pretty(obj));
      setStatus(res.success ? "已儲存。" : `儲存失敗：${res.error}`);
    });
  }

  return (
    <div className="space-y-6">
      {!canEdit ? (
        <div className="rounded-xl border border-[rgba(90,62,43,0.14)] bg-[rgba(214,168,108,0.10)] px-4 py-3 text-sm text-[#6F5A46]">
          你目前是 <span className="font-semibold text-[#3A2A1E]">editor</span>{" "}
          權限，可查看全站設定，但不可修改。請聯繫{" "}
          <span className="font-semibold text-[#3A2A1E]">admin</span> 或{" "}
          <span className="font-semibold text-[#3A2A1E]">super_admin</span>。
        </div>
      ) : null}
      {status ? (
        <div className="rounded-xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 px-4 py-3 text-sm text-[#6F5A46]">
          {status}
        </div>
      ) : null}

      <section className="rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 p-6 shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[#3A2A1E]">brand</h2>
            <p className="mt-1 text-sm text-[#6F5A46]">站名、標語、Logo URL</p>
          </div>
          <button
            type="button"
            disabled={pending || !canEdit}
            onClick={() =>
              save("brand", {
                site_name: brandSiteName,
                tagline: brandTagline,
                logo_url: brandLogoUrl || null,
              })
            }
            className="rounded-xl bg-[#5A3E2B] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_16px_44px_rgba(90,62,43,0.22)] transition hover:bg-[#6B4A34] disabled:opacity-60"
          >
            儲存
          </button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Field
            label="site_name"
            value={brandSiteName}
            onChange={setBrandSiteName}
            disabled={!canEdit}
          />
          <Field
            label="tagline"
            value={brandTagline}
            onChange={setBrandTagline}
            disabled={!canEdit}
          />
          <div className="md:col-span-2 space-y-3">
            <UploadField
              label="Logo 圖片（上傳至 Storage）"
              value={brandLogoUrl}
              bucket="public-assets"
              pathPrefix="logo"
              onUploaded={setBrandLogoUrl}
              helperText="PNG / JPG / WebP / SVG；最多 5MB。"
              disabled={!canEdit}
            />
            <Field
              label="logo_url（可手動貼上或由上傳填入）"
              value={brandLogoUrl}
              onChange={setBrandLogoUrl}
              placeholder="https://... 或 /storage/v1/object/public/..."
              disabled={!canEdit}
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 p-6 shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[#3A2A1E]">links</h2>
            <p className="mt-1 text-sm text-[#6F5A46]">LINE/FB/IG</p>
          </div>
          <button
            type="button"
            disabled={pending || !canEdit}
            onClick={() =>
              save("links", {
                line_official: linksLine || null,
                facebook: linksFb || null,
                instagram: linksIg || null,
              })
            }
            className="rounded-xl bg-[#5A3E2B] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_16px_44px_rgba(90,62,43,0.22)] transition hover:bg-[#6B4A34] disabled:opacity-60"
          >
            儲存
          </button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Field
              label="line_official"
              value={linksLine}
              onChange={setLinksLine}
              disabled={!canEdit}
            />
          </div>
          <Field
            label="facebook"
            value={linksFb}
            onChange={setLinksFb}
            disabled={!canEdit}
          />
          <Field
            label="instagram"
            value={linksIg}
            onChange={setLinksIg}
            disabled={!canEdit}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 p-6 shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[#3A2A1E]">contact</h2>
            <p className="mt-1 text-sm text-[#6F5A46]">客服信箱</p>
          </div>
          <button
            type="button"
            disabled={pending || !canEdit}
            onClick={() => save("contact", { email: contactEmail })}
            className="rounded-xl bg-[#5A3E2B] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_16px_44px_rgba(90,62,43,0.22)] transition hover:bg-[#6B4A34] disabled:opacity-60"
          >
            儲存
          </button>
        </div>
        <div className="mt-6">
          <Field
            label="email"
            value={contactEmail}
            onChange={setContactEmail}
            disabled={!canEdit}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 p-6 shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[#3A2A1E]">theme</h2>
            <p className="mt-1 text-sm text-[#6F5A46]">主要色票</p>
          </div>
          <button
            type="button"
            disabled={pending || !canEdit}
            onClick={() =>
              save("theme", {
                primary_purple: themePrimary,
                deep_purple: themeDeep,
                neon_purple: themeNeon,
                electric_blue: themeBlue,
                energy_red: themeRed,
              })
            }
            className="rounded-xl bg-[#5A3E2B] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_16px_44px_rgba(90,62,43,0.22)] transition hover:bg-[#6B4A34] disabled:opacity-60"
          >
            儲存
          </button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Field
            label="primary_purple"
            value={themePrimary}
            onChange={setThemePrimary}
            disabled={!canEdit}
          />
          <Field
            label="deep_purple"
            value={themeDeep}
            onChange={setThemeDeep}
            disabled={!canEdit}
          />
          <Field
            label="neon_purple"
            value={themeNeon}
            onChange={setThemeNeon}
            disabled={!canEdit}
          />
          <Field
            label="electric_blue"
            value={themeBlue}
            onChange={setThemeBlue}
            disabled={!canEdit}
          />
          <Field
            label="energy_red"
            value={themeRed}
            onChange={setThemeRed}
            disabled={!canEdit}
          />
        </div>
      </section>
    </div>
  );
}

