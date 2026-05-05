import PublicSiteLayout from "@/components/PublicSiteLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

function formatPrice(priceCents: number) {
  return `NT$ ${(priceCents / 100).toLocaleString("zh-TW")}`;
}

export default function ProductPage({ slug }: { slug: string }) {
  const { addItem } = useCart();
  const { data: product, isLoading } = trpc.catalog.bySlug.useQuery({ slug });

  if (isLoading) {
    return (
      <PublicSiteLayout>
        <div className="container py-20">
          <div className="h-[640px] animate-pulse rounded-[2rem] bg-muted/60" />
        </div>
      </PublicSiteLayout>
    );
  }

  if (!product) {
    return (
      <PublicSiteLayout>
        <div className="container py-20">
          <Card className="rounded-[2rem] border-border/70">
            <CardContent className="space-y-6 p-8">
              <p className="font-serif text-3xl text-foreground">找不到這項商品</p>
              <p className="text-sm leading-7 text-muted-foreground">
                商品可能已下架，或網址已變更。你可以先回到商品列表頁繼續瀏覽其他內容。
              </p>
              <Link href="/shop">
                <Button>返回商品列表</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </PublicSiteLayout>
    );
  }

  const specs = product.specs
    .split("\n")
    .map(item => item.trim())
    .filter(Boolean);

  return (
    <PublicSiteLayout>
      <main className="container py-12 md:py-16">
        <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <Link href="/shop" className="hover:text-foreground">
            商品列表
          </Link>
          <span>/</span>
          <span>{product.category}</span>
        </div>

        <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="overflow-hidden rounded-[2.4rem] border border-border/70 bg-card/90 shadow-[0_26px_80px_rgba(31,20,16,0.08)]">
            <div className="aspect-[4/4.2] bg-muted">
              <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
            </div>
          </div>

          <div className="space-y-6">
            <Badge className="rounded-full bg-secondary text-secondary-foreground">{product.category}</Badge>
            <div className="space-y-4">
              <h1 className="font-serif text-4xl text-foreground md:text-5xl">{product.name}</h1>
              <p className="text-lg leading-8 text-muted-foreground">{product.shortDescription}</p>
              <p className="text-3xl font-semibold text-foreground">{formatPrice(product.priceCents)}</p>
            </div>

            <Card className="rounded-[2rem] border-border/60 bg-secondary/35">
              <CardContent className="space-y-5 p-7">
                <p className="font-medium text-foreground">商品描述</p>
                <p className="text-sm leading-8 text-muted-foreground">{product.description}</p>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-border/60 bg-card/90">
              <CardContent className="space-y-4 p-7">
                <p className="font-medium text-foreground">規格資訊</p>
                <div className="space-y-3">
                  {specs.map(spec => (
                    <div key={spec} className="flex items-start gap-3 text-sm leading-7 text-muted-foreground">
                      <CheckCircle2 className="mt-1 h-4 w-4 text-primary" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="rounded-[2rem] border border-border/60 bg-card/90 p-6 shadow-[0_18px_50px_rgba(31,20,16,0.05)]">
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">目前庫存</p>
                  <p className="text-2xl font-semibold text-foreground">{product.inventory}</p>
                </div>
                <p className="text-sm leading-7 text-muted-foreground">目前版本先完成非金流購物流程，結帳後訂單將建立為待付款狀態。</p>
              </div>
              <Button
                className="h-12 w-full rounded-full"
                onClick={() => {
                  addItem({
                    productId: product.id,
                    slug: product.slug,
                    name: product.name,
                    priceCents: product.priceCents,
                    imageUrl: product.imageUrl,
                    quantity: 1,
                  });
                  toast.success("已加入購物車");
                }}
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                加入購物車
              </Button>
            </div>
          </div>
        </section>
      </main>
    </PublicSiteLayout>
  );
}
