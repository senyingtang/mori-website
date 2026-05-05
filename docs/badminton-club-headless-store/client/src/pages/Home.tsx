import PublicSiteLayout from "@/components/PublicSiteLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import {
  ArrowRight,
  Dumbbell,
  ShoppingBag,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react";
import { Link } from "wouter";

function formatPrice(priceCents: number) {
  return `NT$ ${(priceCents / 100).toLocaleString("zh-TW")}`;
}

export default function Home() {
  const { data, isLoading } = trpc.site.home.useQuery();

  return (
    <PublicSiteLayout>
      <main>
        <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top,_rgba(205,162,116,0.22),_transparent_40%),linear-gradient(135deg,_#140f0d_0%,_#241816_45%,_#33211d_100%)] text-white">
          <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.03)_40%,transparent_75%)]" />
          <div className="container relative grid gap-12 py-20 md:grid-cols-[1.1fr_0.9fr] md:py-28">
            <div className="space-y-8">
              <Badge className="rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-white">
                Elegant and Perfect Club Commerce Experience
              </Badge>
              <div className="space-y-5">
                <p className="font-serif text-5xl leading-tight tracking-tight md:text-7xl">
                  {data?.brand.name ?? "Crown Baseball Club"}
                </p>
                <p className="max-w-xl text-lg text-white/70 md:text-xl">
                  {data?.brand.tagline ?? "Precision. Heritage. Performance."}
                </p>
                <p className="max-w-2xl text-base leading-8 text-white/72 md:text-lg">
                  {data?.brand.summary ??
                    "以高端球團品牌形象為核心，將訓練內容、教練專業與官方商品整合為一個一致且具辨識度的品牌網站。"}
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link href="/shop">
                  <Button className="h-12 rounded-full bg-primary px-7 text-primary-foreground hover:bg-primary/90">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    {data?.brand.primaryCta ?? "探索品牌商品"}
                  </Button>
                </Link>
                <a href="#coaches">
                  <Button className="h-12 rounded-full border border-white/15 bg-white/10 px-7 text-white hover:bg-white/14">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    {data?.brand.secondaryCta ?? "認識教練團隊"}
                  </Button>
                </a>
              </div>
              <div className="grid gap-4 pt-4 sm:grid-cols-3">
                {[
                  { label: "品牌陳列", value: "01", icon: Sparkles },
                  { label: "課程系統", value: "03", icon: Dumbbell },
                  { label: "精選商品", value: "04", icon: Trophy },
                ].map(item => (
                  <div
                    key={item.label}
                    className="rounded-[1.5rem] border border-white/10 bg-white/6 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
                  >
                    <item.icon className="mb-4 h-5 w-5 text-primary" />
                    <p className="text-2xl font-semibold text-white">{item.value}</p>
                    <p className="mt-2 text-sm text-white/66">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative flex min-h-[500px] items-end">
              <div className="absolute inset-10 rounded-full bg-primary/18 blur-3xl" />
              <div className="relative w-full overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.14),rgba(255,255,255,0.05))] p-6 shadow-[0_36px_90px_rgba(0,0,0,0.34)]">
                <div className="rounded-[1.7rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(0,0,0,0.16))] p-8">
                  <div className="mb-16 flex items-center justify-between text-xs uppercase tracking-[0.25em] text-white/55">
                    <span>Official Club Identity</span>
                    <span>2026 Edition</span>
                  </div>
                  <div className="space-y-6">
                    <p className="font-serif text-4xl leading-tight text-white md:text-5xl">
                      Elevating baseball culture with refined coaching and signature goods.
                    </p>
                    <p className="max-w-md text-sm leading-7 text-white/68">
                      從內容編排、教練陣容到品牌商品呈現，首頁被設計成一個能同時說明球團價值與導入商城轉換的核心入口。
                    </p>
                  </div>
                  <div className="mt-16 grid gap-4 md:grid-cols-2">
                    <div className="rounded-[1.4rem] border border-white/10 bg-white/7 p-5">
                      <p className="text-sm uppercase tracking-[0.25em] text-white/55">Club Philosophy</p>
                      <p className="mt-3 text-lg text-white">精準訓練與高端品牌感並行</p>
                    </div>
                    <div className="rounded-[1.4rem] border border-white/10 bg-white/7 p-5">
                      <p className="text-sm uppercase tracking-[0.25em] text-white/55">Storefront Focus</p>
                      <p className="mt-3 text-lg text-white">內容導流至精選商品與完整目錄</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="coaches" className="container py-20 md:py-24">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <Badge variant="secondary" className="rounded-full px-4 py-1.5">教練介紹</Badge>
              <h2 className="font-serif text-4xl text-foreground md:text-5xl">專業教練團隊</h2>
              <p className="max-w-2xl text-base leading-8 text-muted-foreground">
                教練介紹區塊以高辨識卡片呈現，每位教練都具備明確專長、經歷與訓練理念，讓訪客快速理解球團的教學深度。
              </p>
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {(data?.coaches ?? []).map(coach => (
              <Card key={coach.id} className="overflow-hidden rounded-[2rem] border-border/70 bg-card/80 shadow-[0_26px_80px_rgba(31,20,16,0.08)]">
                <div className="aspect-[4/5] overflow-hidden bg-muted">
                  <img src={coach.photoUrl} alt={coach.name} className="h-full w-full object-cover" />
                </div>
                <CardContent className="space-y-4 p-6">
                  <div className="space-y-2">
                    <p className="font-serif text-2xl text-foreground">{coach.name}</p>
                    <p className="text-sm uppercase tracking-[0.2em] text-primary">{coach.specialty}</p>
                  </div>
                  <p className="text-sm leading-7 text-muted-foreground">{coach.experience}</p>
                  <p className="text-sm leading-7 text-muted-foreground">{coach.bio}</p>
                </CardContent>
              </Card>
            ))}
            {isLoading &&
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-[520px] animate-pulse rounded-[2rem] bg-muted/60" />
              ))}
          </div>
        </section>

        <section className="bg-secondary/40 py-20 md:py-24">
          <div className="container">
            <div className="mb-10 space-y-3">
              <Badge variant="secondary" className="rounded-full px-4 py-1.5">課程介紹</Badge>
              <h2 className="font-serif text-4xl text-foreground md:text-5xl">系統化教學內容</h2>
              <p className="max-w-2xl text-base leading-8 text-muted-foreground">
                課程區塊以適合對象、課程類型與訓練亮點為主軸，兼顧品牌感與資訊完整度，方便後續在後台持續擴充內容。
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {(data?.courses ?? []).map(course => (
                <Card key={course.id} className="rounded-[2rem] border-border/60 bg-background/86 shadow-[0_18px_50px_rgba(40,24,20,0.06)]">
                  <CardContent className="space-y-5 p-7">
                    <Badge className="rounded-full border border-primary/15 bg-primary/10 text-primary hover:bg-primary/10">
                      {course.courseType}
                    </Badge>
                    <div className="space-y-3">
                      <h3 className="font-serif text-2xl text-foreground">{course.title}</h3>
                      <p className="text-sm text-primary">適合對象：{course.targetAudience}</p>
                      <p className="text-sm leading-7 text-muted-foreground">{course.summary}</p>
                      <p className="rounded-[1.4rem] bg-secondary p-4 text-sm leading-7 text-foreground">
                        {course.highlight}
                      </p>
                    </div>
                    <p className="text-sm leading-7 text-muted-foreground">{course.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="container py-20 md:py-24">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <Badge variant="secondary" className="rounded-full px-4 py-1.5">精選商品</Badge>
              <h2 className="font-serif text-4xl text-foreground md:text-5xl">品牌自創商品</h2>
              <p className="max-w-2xl text-base leading-8 text-muted-foreground">
                首頁精選商品區塊作為從品牌內容導向商業轉換的第一層入口，呈現商品圖片、品名與價格，並可導向完整商品目錄。
              </p>
            </div>
            <Link href="/shop">
              <Button className="rounded-full px-6">查看完整商品列表</Button>
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {(data?.featuredProducts ?? []).map(product => (
              <Link key={product.id} href={`/products/${product.slug}`}>
                <Card className="group h-full overflow-hidden rounded-[2rem] border-border/70 bg-card/90 transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_26px_80px_rgba(31,20,16,0.12)]">
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="space-y-3 p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-serif text-2xl text-foreground">{product.name}</p>
                        <p className="mt-2 text-sm text-muted-foreground">{product.shortDescription}</p>
                      </div>
                      <Badge className="rounded-full bg-secondary text-secondary-foreground">{product.category}</Badge>
                    </div>
                    <div className="flex items-center justify-between pt-3">
                      <p className="text-lg font-semibold text-foreground">{formatPrice(product.priceCents)}</p>
                      <div className="flex items-center gap-2 text-sm text-primary">
                        <Star className="h-4 w-4 fill-current" />
                        精選推薦
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </PublicSiteLayout>
  );
}
