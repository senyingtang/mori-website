"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { createContactSubmission } from "@/app/contact/actions";

export type ContactInquiryType =
  | "dropin"
  | "teaching"
  | "product_notify"
  | "venue_partner"
  | "brand_partner"
  | "system_partner"
  | "other";

const INQUIRY_OPTIONS: { value: ContactInquiryType; label: string }[] = [
  { value: "dropin", label: "臨打報名" },
  { value: "teaching", label: "羽球教學" },
  { value: "product_notify", label: "商品通知" },
  { value: "venue_partner", label: "場地合作" },
  { value: "brand_partner", label: "品牌合作" },
  { value: "system_partner", label: "系統合作" },
  { value: "other", label: "其他" },
];

type Hidden = {
  source_path?: string;
  source_type?: string;
  source_id?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
};

type Props = Hidden & {
  defaultInquiryType?: ContactInquiryType;
};

export function ContactForm({
  defaultInquiryType,
  source_path,
  source_type,
  source_id,
  utm_source,
  utm_medium,
  utm_campaign,
}: Props) {
  const startedAtRef = useRef<number>(
    (() => {
      try {
        return Date.now();
      } catch {
        return 0;
      }
    })()
  );
  const websiteRef = useRef<HTMLInputElement>(null);

  const [pending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultType = useMemo<ContactInquiryType>(
    () => defaultInquiryType ?? "other",
    [defaultInquiryType]
  );

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [lineId, setLineId] = useState("");
  const [inquiryType, setInquiryType] = useState<ContactInquiryType>(defaultType);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  function submit() {
    setError(null);
    setSuccess(false);

    const fd = new FormData();
    fd.set("name", name);
    fd.set("phone", phone);
    fd.set("email", email);
    fd.set("line_id", lineId);
    fd.set("inquiry_type", inquiryType);
    fd.set("subject", subject);
    fd.set("message", message);

    if (source_path) fd.set("source_path", source_path);
    if (source_type) fd.set("source_type", source_type);
    if (source_id) fd.set("source_id", source_id);
    if (utm_source) fd.set("utm_source", utm_source);
    if (utm_medium) fd.set("utm_medium", utm_medium);
    if (utm_campaign) fd.set("utm_campaign", utm_campaign);

    fd.set("website", websiteRef.current?.value ?? "");
    try {
      fd.set("started_at", String(startedAtRef.current));
    } catch {
      fd.set("started_at", "");
    }

    startTransition(async () => {
      const res = await createContactSubmission(fd);
      if (!res.success) {
        setError(res.error);
        return;
      }
      setSuccess(true);
      setName("");
      setPhone("");
      setEmail("");
      setLineId("");
      setInquiryType(defaultType);
      setSubject("");
      setMessage("");
    });
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 px-6 py-10 text-center text-sm text-[#3A2A1E] shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md">
        已收到你的訊息，我們會盡快與你聯繫。
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 p-6 shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md">
      {error ? (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-900/90">
          {error}
        </div>
      ) : null}

      <div
        className="absolute -left-[10000px] top-0 h-px w-px overflow-hidden opacity-0"
        aria-hidden="true"
      >
        <label htmlFor="contact-form-website">Website</label>
        <input
          ref={websiteRef}
          id="contact-form-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-[#8B735C]">姓名 *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.72)] px-4 py-2.5 text-sm text-[#3A2A1E] placeholder:text-[#9A846E] focus:border-[rgba(185,133,82,0.35)] focus:outline-none focus:ring-1 focus:ring-[rgba(185,133,82,0.22)]"
            placeholder="王小明"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#8B735C]">手機</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.72)] px-4 py-2.5 text-sm text-[#3A2A1E] placeholder:text-[#9A846E] focus:border-[rgba(185,133,82,0.35)] focus:outline-none focus:ring-1 focus:ring-[rgba(185,133,82,0.22)]"
            placeholder="09xx-xxx-xxx"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#8B735C]">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.72)] px-4 py-2.5 text-sm text-[#3A2A1E] placeholder:text-[#9A846E] focus:border-[rgba(185,133,82,0.35)] focus:outline-none focus:ring-1 focus:ring-[rgba(185,133,82,0.22)]"
            placeholder="name@example.com"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-[#8B735C]">LINE ID</label>
          <input
            value={lineId}
            onChange={(e) => setLineId(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.72)] px-4 py-2.5 text-sm text-[#3A2A1E] placeholder:text-[#9A846E] focus:border-[rgba(185,133,82,0.35)] focus:outline-none focus:ring-1 focus:ring-[rgba(185,133,82,0.22)]"
            placeholder="line_id"
          />
          <p className="mt-1 text-[11px] text-[#9A846E]">
            Email／手機／LINE ID 至少填一個，方便我們回覆你。
          </p>
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-[#8B735C]">詢問類型 *</label>
          <select
            value={inquiryType}
            onChange={(e) => setInquiryType(e.target.value as ContactInquiryType)}
            className="mt-1 w-full rounded-xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.72)] px-4 py-2.5 text-sm text-[#3A2A1E] focus:border-[rgba(185,133,82,0.35)] focus:outline-none focus:ring-1 focus:ring-[rgba(185,133,82,0.22)]"
          >
            {INQUIRY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#FFF8ED]">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-[#8B735C]">主旨</label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.72)] px-4 py-2.5 text-sm text-[#3A2A1E] placeholder:text-[#9A846E] focus:border-[rgba(185,133,82,0.35)] focus:outline-none focus:ring-1 focus:ring-[rgba(185,133,82,0.22)]"
            placeholder="想詢問開團／教學／商品..."
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-[#8B735C]">訊息 *</label>
          <textarea
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.72)] px-4 py-3 text-sm text-[#3A2A1E] placeholder:text-[#9A846E] focus:border-[rgba(185,133,82,0.35)] focus:outline-none focus:ring-1 focus:ring-[rgba(185,133,82,0.22)]"
            placeholder="請描述你的需求（時間、地點、程度、預算或其他資訊）..."
          />
        </div>
      </div>

      <button
        type="button"
        disabled={pending}
        onClick={submit}
        className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[#5A3E2B] px-6 py-3 text-sm font-semibold text-[#FFF8ED] shadow-[0_16px_42px_rgba(90,62,43,0.18)] transition hover:bg-[#B98552] disabled:opacity-60"
      >
        送出
      </button>
    </div>
  );
}

