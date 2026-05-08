import { requireAdminUser } from "@/lib/auth/permissions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProductsEditor } from "@/components/admin/ProductsEditor";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  await requireAdminUser();
  const supabase = await createSupabaseServerClient();

  const [{ data: products, error: pErr }, { data: cats, error: cErr }] =
    await Promise.all([
      supabase
        .from("products")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
      supabase
        .from("product_categories")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
    ]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 px-6 py-8 shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md">
        <h1 className="text-2xl font-bold text-[#3A2A1E]">商品</h1>
        <p className="mt-2 text-sm text-[#6F5A46]">
          管理{" "}
          <code className="rounded bg-[rgba(214,168,108,0.16)] px-1 text-[#5A3E2B]">
            products
          </code>{" "}
          與{" "}
          <code className="rounded bg-[rgba(214,168,108,0.16)] px-1 text-[#5A3E2B]">
            product_categories
          </code>
          。
        </p>
        {pErr ? (
          <p className="mt-3 text-sm text-red-900/90">
            products 讀取失敗：{pErr.message}
          </p>
        ) : null}
        {cErr ? (
          <p className="mt-1 text-sm text-red-900/90">
            product_categories 讀取失敗：{cErr.message}
          </p>
        ) : null}
      </div>

      <ProductsEditor
        products={(products ?? []) as unknown[]}
        categories={(cats ?? []) as unknown[]}
      />
    </div>
  );
}

