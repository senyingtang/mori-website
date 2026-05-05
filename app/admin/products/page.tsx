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
      <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-6 py-8 backdrop-blur-md">
        <h1 className="text-2xl font-bold text-white">商品</h1>
        <p className="mt-2 text-sm text-white/55">
          管理 <code className="rounded bg-black/30 px-1">products</code> 與{" "}
          <code className="rounded bg-black/30 px-1">product_categories</code>。
        </p>
        {pErr ? (
          <p className="mt-3 text-sm text-red-200/90">
            products 讀取失敗：{pErr.message}
          </p>
        ) : null}
        {cErr ? (
          <p className="mt-1 text-sm text-red-200/90">
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

