import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/env";
import { getDefaultOgImageFromSettings } from "@/lib/cms/brand";
import {
  fetchPublicSiteSettings,
  fetchSeoSettingsByPageKey,
} from "@/lib/cms/public-queries";
import type { SeoSettingsRow } from "@/lib/cms/types";

const NOINDEX_FALLBACK_KEYS = new Set([
  "login",
  "register",
  "member_dashboard",
  "line_binding",
]);

function rowToMetadata(
  row: SeoSettingsRow,
  path: string,
  defaultOgImage?: string
): Metadata {
  const base = getSiteUrl();
  const canonical =
    row.canonical_url?.trim() ||
    (base ? `${base}${path === "/" ? "" : path}` : undefined);

  const ogFromRow = row.og_image_url?.trim();
  const fallbackOg = defaultOgImage?.trim();
  const imageUrl = ogFromRow || fallbackOg || "";
  const ogImages = imageUrl ? [{ url: imageUrl }] : undefined;
  const twImages = imageUrl ? [imageUrl] : undefined;

  return {
    title: row.title,
    description: row.meta_description,
    robots: row.noindex ? { index: false, follow: true } : undefined,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title: row.og_title ?? row.title,
      description: row.og_description ?? row.meta_description,
      url: canonical,
      ...(ogImages ? { images: ogImages } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: row.og_title ?? row.title,
      description: row.og_description ?? row.meta_description,
      ...(twImages ? { images: twImages } : {}),
    },
  };
}

const FALLBACK: Record<string, { title: string; description: string }> = {
  home: {
    title: "森映球團｜桃園羽球教學、臨打報名與 LINE 羽球系統",
    description:
      "森映球團提供桃園、中壢及多地羽球教學與臨打服務，整合 LINE 報名、候補通知與會員綁定系統。",
  },
  coaches: {
    title: "羽球教練團介紹｜森映球團",
    description:
      "查看森映球團羽球教練團，了解教練專長、教學地區、適合程度與教學風格，適合新手入門、進階訓練與羽球臨打前的技術提升。",
  },
  products: {
    title: "羽球商品專區｜球團隊服、羽球配件與限定周邊",
    description:
      "森映球團商品專區將推出球團隊服、運動毛巾、羽球配件與限定周邊商品，打造專屬羽球品牌風格。",
  },
  login: {
    title: "會員登入｜森映球團",
    description: "會員登入以查看報名與預約紀錄。",
  },
  register: {
    title: "會員註冊｜森映球團",
    description: "建立會員帳號。",
  },
  member_dashboard: {
    title: "會員中心｜森映球團",
    description: "個人資料與服務紀錄。",
  },
  line_binding: {
    title: "LINE 綁定｜森映球團",
    description: "綁定 LINE 以接收報名與候補通知。",
  },
  contact: {
    title: "聯絡我們｜森映球團",
    description: "臨打、教學、合作洽詢。",
  },
  privacy_policy: {
    title: "隱私權政策｜森映球團",
    description: "個人資料與 Cookie 說明。",
  },
  terms: {
    title: "使用條款｜森映球團",
    description: "網站使用與報名、購物相關規範。",
  },
  locations: {
    title: "森映球團據點｜羽球教學與臨打場地總覽",
    description:
      "查看森映球團目前提供羽球教學與臨打服務的合作場地與據點，包含縣市、區域、場地資訊與場次摘要。",
  },
  sessions: {
    title: "羽球臨打與教學場次｜森映球團",
    description:
      "查看森映球團羽球臨打、教學與訓練場次，包含時間、程度限制、用球、費用與合作場地資訊。",
  },
};

/**
 * 由 seo_settings 組出 Next Metadata；無 DB 或無資料時用靜態 fallback。
 * `path` 用於組 canonical（若 DB 未填 canonical_url）。
 */
export async function buildPageMetadata(
  pageKey: keyof typeof FALLBACK,
  path: string
): Promise<Metadata> {
  const settingsMap = await fetchPublicSiteSettings();
  const defaultOg = getDefaultOgImageFromSettings(settingsMap);

  const row = await fetchSeoSettingsByPageKey(pageKey);
  if (row) return rowToMetadata(row, path, defaultOg);

  const fb = FALLBACK[pageKey];
  const base = getSiteUrl();
  const canonical =
    base && path
      ? `${base}${path === "/" ? "" : path}`
      : undefined;

  const meta: Metadata = {
    title: fb.title,
    description: fb.description,
    robots: NOINDEX_FALLBACK_KEYS.has(String(pageKey))
      ? { index: false, follow: true }
      : undefined,
    alternates: canonical ? { canonical } : undefined,
  };

  const og = defaultOg?.trim();
  if (og) {
    meta.openGraph = {
      title: fb.title,
      description: fb.description,
      url: canonical,
      images: [{ url: og }],
    };
    meta.twitter = {
      card: "summary_large_image",
      title: fb.title,
      description: fb.description,
      images: [og],
    };
  }

  return meta;
}
