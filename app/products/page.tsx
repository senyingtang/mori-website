import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  fetchSeoSettingsByPageKey,
  getActiveProductCategories,
  getFaqsByPageKey,
  getPublicProducts,
} from "@/lib/cms/public-queries";
import { ProductsPage } from "@/components/products/ProductsPage";
import type { ProductCategory, ProductWithCategory } from "@/types/cms";
import { PublicFAQSection } from "@/components/common/PublicFAQSection";
import { getSiteUrl } from "@/lib/env";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  isNonEmptyJsonLd,
} from "@/lib/seo/jsonld";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("products", "/products");
}

export const dynamic = "force-dynamic";

const FALLBACK_CATEGORIES: ProductCategory[] = [
  {
    id: "fallback-cat",
    name: "球團周邊",
    slug: "merch",
    description: "限定周邊籌備中。",
    sort_order: 0,
    is_active: true,
    created_at: null,
    updated_at: null,
  },
];

const FALLBACK_PRODUCTS: ProductWithCategory[] = [
  {
    id: "fallback-product",
    name: "限定球衣（籌備中）",
    slug: "coming-soon",
    description: "球團限定球衣籌備中，敬請期待。",
    price: null,
    compare_at_price: null,
    image_url: null,
    category_id: "fallback-cat",
    status: "coming_soon",
    stock_quantity: 0,
    is_active: true,
    sort_order: 0,
    created_at: null,
    updated_at: null,
    category: FALLBACK_CATEGORIES[0],
  },
];

export default async function ProductsPublicPage() {
  const [products, categories, faqs, seoRow] = await Promise.all([
    getPublicProducts(),
    getActiveProductCategories(),
    getFaqsByPageKey("products"),
    fetchSeoSettingsByPageKey("products"),
  ]);

  const base = getSiteUrl();
  const manualSchema = seoRow?.schema_json;
  const autoSchema = [
    buildBreadcrumbSchema([
      { name: "首頁", url: base ? `${base}/` : "/" },
      { name: "商品", url: base ? `${base}/products` : "/products" },
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
      <ProductsPage
        products={products.length > 0 ? products : FALLBACK_PRODUCTS}
        categories={categories.length > 0 ? categories : FALLBACK_CATEGORIES}
      />
      <PublicFAQSection
        title="商品常見問題"
        description="關於開賣時間、預購方式與尺寸資訊。"
        faqs={faqs}
      />
    </>
  );
}
