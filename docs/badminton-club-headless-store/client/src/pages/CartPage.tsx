import PublicSiteLayout from "@/components/PublicSiteLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/contexts/CartContext";
import { trpc } from "@/lib/trpc";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Link } from "wouter";

function formatPrice(priceCents: number) {
  return `NT$ ${(priceCents / 100).toLocaleString("zh-TW")}`;
}

export default function CartPage() {
  const { items, subtotalCents, updateQuantity, removeItem, clearCart } = useCart();
  const createOrder = trpc.order.create.useMutation();
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    note: "",
  });

  const orderItems = useMemo(
    () => items.map(item => ({ productId: item.productId, quantity: item.quantity })),
    [items],
  );

  const serviceFeeCents = items.length > 0 ? 12000 : 0;
  const totalCents = subtotalCents + serviceFeeCents;

  return (
    <PublicSiteLayout>
      <main className="container py-12 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-6">
            <div className="space-y-3">
              <p className="font-serif text-4xl text-foreground md:text-5xl">購物車與結帳流程</p>
              <p className="max-w-3xl text-base leading-8 text-muted-foreground">
                此版本先完成非金流流程。使用者可在此調整商品數量、查看訂單摘要並建立待付款訂單，後續即可直接銜接 Stripe 付款流程。
              </p>
            </div>

            <div className="space-y-4">
              {items.length === 0 ? (
                <Card className="rounded-[2rem] border-border/70 bg-card/90">
                  <CardContent className="space-y-5 p-8 text-center">
                    <ShoppingBag className="mx-auto h-10 w-10 text-primary" />
                    <p className="font-serif text-2xl text-foreground">你的購物車目前是空的</p>
                    <p className="text-sm leading-7 text-muted-foreground">
                      先到商品列表挑選你喜歡的品牌商品，再回到此處完成訂單建立。
                    </p>
                    <div>
                      <Link href="/shop">
                        <Button className="rounded-full px-6">前往商品列表</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                items.map(item => (
                  <Card key={item.productId} className="rounded-[2rem] border-border/70 bg-card/95">
                    <CardContent className="grid gap-5 p-5 md:grid-cols-[160px_1fr_auto] md:items-center">
                      <div className="overflow-hidden rounded-[1.4rem] bg-muted">
                        <img src={item.imageUrl} alt={item.name} className="aspect-[4/3] w-full object-cover" />
                      </div>
                      <div className="space-y-2">
                        <p className="font-serif text-2xl text-foreground">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{formatPrice(item.priceCents)}</p>
                        <div className="flex items-center gap-3 pt-3">
                          <Button
                            className="h-10 w-10 rounded-full border border-border bg-background p-0 text-foreground hover:bg-secondary"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="min-w-10 text-center text-lg font-semibold text-foreground">{item.quantity}</span>
                          <Button
                            className="h-10 w-10 rounded-full border border-border bg-background p-0 text-foreground hover:bg-secondary"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-4">
                        <p className="text-lg font-semibold text-foreground">
                          {formatPrice(item.priceCents * item.quantity)}
                        </p>
                        <Button
                          className="rounded-full border border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive/15"
                          onClick={() => removeItem(item.productId)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          移除
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </section>

          <aside className="space-y-6">
            <Card className="rounded-[2rem] border-border/70 bg-card/95 shadow-[0_24px_60px_rgba(31,20,16,0.08)]">
              <CardContent className="space-y-6 p-7">
                <p className="font-serif text-3xl text-foreground">訂單摘要</p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>商品小計</span>
                    <span>{formatPrice(subtotalCents)}</span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>服務處理費</span>
                    <span>{formatPrice(serviceFeeCents)}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-border pt-4 text-base font-semibold text-foreground">
                    <span>預估總計</span>
                    <span>{formatPrice(totalCents)}</span>
                  </div>
                </div>
                <p className="text-sm leading-7 text-muted-foreground">
                  後續若接上 Stripe，這裡可直接延伸為付款摘要與信用卡付款入口，並同步更新訂單狀態。
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-border/70 bg-secondary/35">
              <CardContent className="space-y-5 p-7">
                <p className="font-serif text-3xl text-foreground">建立待付款訂單</p>
                <div className="space-y-3">
                  <Label htmlFor="customerName">姓名</Label>
                  <Input
                    id="customerName"
                    value={form.customerName}
                    onChange={event => setForm(current => ({ ...current, customerName: event.target.value }))}
                    placeholder="請輸入姓名"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="customerEmail">Email</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={form.customerEmail}
                    onChange={event => setForm(current => ({ ...current, customerEmail: event.target.value }))}
                    placeholder="name@example.com"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="customerPhone">電話</Label>
                  <Input
                    id="customerPhone"
                    value={form.customerPhone}
                    onChange={event => setForm(current => ({ ...current, customerPhone: event.target.value }))}
                    placeholder="0900-000-000"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="note">備註</Label>
                  <Textarea
                    id="note"
                    value={form.note}
                    onChange={event => setForm(current => ({ ...current, note: event.target.value }))}
                    placeholder="例如尺寸需求、聯絡偏好或其他補充"
                  />
                </div>
                <Button
                  disabled={items.length === 0 || createOrder.isPending}
                  className="h-12 w-full rounded-full"
                  onClick={async () => {
                    if (!form.customerName || !form.customerEmail || !form.customerPhone) {
                      toast.error("請先完整填寫聯絡資訊");
                      return;
                    }

                    try {
                      const result = await createOrder.mutateAsync({
                        ...form,
                        note: form.note || undefined,
                        items: orderItems,
                      });
                      if (result.notificationStatus === "sent") {
                        toast.success(`訂單 ${result.orderNumber} 已建立，管理員通知已送出`);
                      } else {
                        toast.warning(`訂單 ${result.orderNumber} 已建立，但管理員通知未成功送出`);
                      }
                      clearCart();
                      setForm({ customerName: "", customerEmail: "", customerPhone: "", note: "" });
                    } catch (error) {
                      toast.error(error instanceof Error ? error.message : "建立訂單失敗");
                    }
                  }}
                >
                  建立待付款訂單
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </PublicSiteLayout>
  );
}
