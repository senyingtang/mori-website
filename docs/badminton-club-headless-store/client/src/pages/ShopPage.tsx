import PublicSiteLayout from "@/components/PublicSiteLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useMemo, useState } from "react";
import { Link } from "wouter";

function formatPrice(priceCents: number) {
  return `NT$ ${(priceCents / 100).toLocaleString("zh-TW")}`;
}

export default function ShopPage() {
  const { data, isLoading } = trpc.catalog.list.useQuery();
  const [activeCategory, setActiveCategory] = useState<string>("全部");

  const categories = useMemo(
    () => ["全部", ...(data?.categories ?? [])],
    [data?.categories],
  );

  const products = useMemo(() => {
    const list = data?.products ?? [];
    if (activeCategory === "全部") return list;
    return list.filter(product => product.category === activeCategory);
  }, [activeCategory, data?.products]);

  return (
    <PublicSiteLayout>
      <main>
        <section className="border-b border-border/60 bg-secondary/35">
          <div className="container grid gap-8 py-16 md:grid-cols-[1fr_auto] md:items-end">
            <div className="space-y-4">
              <Badge variant="secondary" className="rounded-full px-4 py-1.5">商品列表頁</Badge>
              <h1 className="font-serif text-4xl text-foreground md:text-6xl">完整品牌商品目錄</h1>
              <p className="max-w-3xl text-base leading-8 text-muted-foreground">
                商品列表頁支援分類篩選，讓訪客能快速依商品屬性瀏覽品牌服飾、配件與裝備，並導向商品詳情頁進一步了解規格與描述。
              </p>
            </div>
            <div className="rounded-[1.8rem] border border-border/70 bg-card/80 px-6 py-5 text-right shadow-[0_18px_50px_rgba(31,20,16,0.08)]">
              <p className="text-sm text-muted-foreground">目前上架商品</p>
              <p className="mt-2 font-serif text-4xl text-foreground">{data?.products.length ?? 0}</p>
            </div>
          </div>
        </section>

        <section className="container py-12 md:py-16">
          <div className="mb-8 flex flex-wrap gap-3">
            {categories.map(category => (
              <Button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={
                  activeCategory === category
                    ? "rounded-full"
                    : "rounded-full border border-border bg-background text-foreground hover:bg-secondary"
                }
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.map(product => (
              <Link key={product.id} href={`/products/${product.slug}`}>
                <Card className="group h-full overflow-hidden rounded-[2rem] border-border/70 bg-card/95 transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(31,20,16,0.12)]">
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="space-y-4 p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <p className="font-serif text-2xl text-foreground">{product.name}</p>
                        <p className="text-sm leading-7 text-muted-foreground">{product.shortDescription}</p>
                      </div>
                      <Badge className="rounded-full bg-secondary text-secondary-foreground">{product.category}</Badge>
                    </div>
                    <div className="flex items-center justify-between border-t border-border/60 pt-4">
                      <div>
                        <p className="text-sm text-muted-foreground">售價</p>
                        <p className="text-lg font-semibold text-foreground">{formatPrice(product.priceCents)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">庫存</p>
                        <p className="text-lg text-foreground">{product.inventory}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}

            {isLoading &&
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-[420px] animate-pulse rounded-[2rem] bg-muted/60" />
              ))}
          </div>
        </section>
      </main>
    </PublicSiteLayout>
  );
}
