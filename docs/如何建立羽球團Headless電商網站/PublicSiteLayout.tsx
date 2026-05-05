import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";
import { ShoppingBag, ShieldCheck } from "lucide-react";
import { Link, useLocation } from "wouter";

const navigation = [
  { label: "首頁", href: "/" },
  { label: "商品列表", href: "/shop" },
  { label: "管理後台", href: "/admin" },
];

export default function PublicSiteLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { itemCount } = useCart();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[rgba(20,16,14,0.82)] backdrop-blur-xl supports-[backdrop-filter]:bg-[rgba(20,16,14,0.72)]">
        <div className="container flex h-18 items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_rgba(255,255,255,0.04))] text-lg font-semibold text-white shadow-[0_10px_40px_rgba(0,0,0,0.25)]">
              CB
            </div>
            <div className="min-w-0">
              <p className="font-serif text-lg tracking-[0.24em] text-white">CROWN BASEBALL</p>
              <p className="text-xs uppercase tracking-[0.3em] text-white/55">Official Club Store</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 md:flex">
            {navigation.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm transition-colors",
                  location === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-white/75 hover:text-white",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/cart">
              <Button className="rounded-full border border-white/10 bg-white/8 text-white hover:bg-white/14">
                <ShoppingBag className="mr-2 h-4 w-4" />
                購物車
                <span className="ml-2 rounded-full bg-white/15 px-2 py-0.5 text-xs">{itemCount}</span>
              </Button>
            </Link>
          </div>
        </div>
        <div className="container pb-4 md:hidden">
          <div className="flex gap-2 overflow-x-auto rounded-full border border-white/10 bg-white/5 p-1">
            {navigation.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "whitespace-nowrap rounded-full px-4 py-2 text-sm transition-colors",
                  location === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-white/75 hover:text-white",
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <div>{children}</div>

      <footer className="border-t border-border/60 bg-secondary/30">
        <div className="container grid gap-10 py-14 md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <p className="font-serif text-2xl text-foreground">Crown Baseball Club</p>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
              這是一個以品牌形象、訓練內容與官方商品為核心的球團網站原型，先完成非金流版本，後續可直接銜接線上付款與訂單付款狀態同步機制。
            </p>
          </div>
          <div className="space-y-4 rounded-[2rem] border border-border/70 bg-card/70 p-6 shadow-[0_24px_60px_rgba(27,20,18,0.08)]">
            <div className="flex items-center gap-3 text-sm text-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              管理後台採管理員權限控管
            </div>
            <p className="text-sm leading-7 text-muted-foreground">
              商品、教練與課程圖片可由後台上傳並儲存至雲端，網站端則使用可直接引用的公開路徑顯示。
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
