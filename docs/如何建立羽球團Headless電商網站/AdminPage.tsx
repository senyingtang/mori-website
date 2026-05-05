import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Package, ShieldAlert, ShoppingBag, Sparkles, Trophy, Users } from "lucide-react";
import { ChangeEvent, useMemo, useState } from "react";
import { toast } from "sonner";

const blankCoach = {
  id: undefined as number | undefined,
  name: "",
  specialty: "",
  experience: "",
  bio: "",
  photoUrl: "",
  photoKey: undefined as string | undefined,
  sortOrder: 0,
  featured: true,
  active: true,
};

const blankCourse = {
  id: undefined as number | undefined,
  title: "",
  courseType: "",
  targetAudience: "",
  summary: "",
  description: "",
  highlight: "",
  sortOrder: 0,
  featured: true,
  active: true,
};

const blankProduct = {
  id: undefined as number | undefined,
  name: "",
  slug: "",
  category: "服飾",
  shortDescription: "",
  description: "",
  specs: "",
  priceCents: 0,
  imageUrl: "",
  imageKey: undefined as string | undefined,
  featured: true,
  active: true,
  inventory: 0,
};

function formatPrice(priceCents: number) {
  return `NT$ ${(priceCents / 100).toLocaleString("zh-TW")}`;
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("圖片讀取失敗"));
    reader.readAsDataURL(file);
  });
}

export default function AdminPage() {
  const { user } = useAuth();
  const utils = trpc.useUtils();
  const dashboard = trpc.admin.dashboard.useQuery(undefined, {
    enabled: user?.role === "admin",
  });
  const saveCoach = trpc.admin.saveCoach.useMutation();
  const saveCourse = trpc.admin.saveCourse.useMutation();
  const saveProduct = trpc.admin.saveProduct.useMutation();
  const uploadImage = trpc.media.uploadImage.useMutation();

  const [coachForm, setCoachForm] = useState(blankCoach);
  const [courseForm, setCourseForm] = useState(blankCourse);
  const [productForm, setProductForm] = useState(blankProduct);

  const stats = useMemo(
    () => [
      { label: "教練", value: dashboard.data?.coaches.length ?? 0, icon: Users },
      { label: "課程", value: dashboard.data?.courses.length ?? 0, icon: Sparkles },
      { label: "商品", value: dashboard.data?.products.length ?? 0, icon: Package },
      { label: "訂單", value: dashboard.data?.orders.length ?? 0, icon: ShoppingBag },
    ],
    [dashboard.data],
  );

  async function handleImageUpload(
    event: ChangeEvent<HTMLInputElement>,
    folder: "coaches" | "products",
    apply: (result: { url: string; key: string }) => void,
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await readFileAsDataUrl(file);
      const result = await uploadImage.mutateAsync({
        filename: file.name,
        dataUrl,
        folder,
      });
      apply(result);
      toast.success("圖片已上傳至雲端");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "圖片上傳失敗");
    }
  }

  async function refreshDashboard() {
    await utils.admin.dashboard.invalidate();
  }

  if (!user) {
    return <DashboardLayout><div /></DashboardLayout>;
  }

  if (user.role !== "admin") {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-3xl py-10">
          <Card className="rounded-[2rem] border-border/70 bg-card/95">
            <CardContent className="space-y-5 p-8">
              <div className="flex items-center gap-3 text-foreground">
                <ShieldAlert className="h-5 w-5 text-destructive" />
                <p className="font-serif text-3xl">你目前沒有管理員權限</p>
              </div>
              <p className="text-sm leading-7 text-muted-foreground">
                後台管理僅開放給管理員帳號使用。若你是網站擁有者，請在資料庫中將帳號角色調整為 admin 後再進入此頁面。
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map(item => (
            <Card key={item.label} className="rounded-[1.8rem] border-border/70 bg-card/95">
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="mt-2 font-serif text-4xl text-foreground">{item.value}</p>
                </div>
                <div className="rounded-full bg-primary/10 p-3 text-primary">
                  <item.icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <Card className="rounded-[2rem] border-border/70 bg-card/95">
          <CardContent className="space-y-5 p-7">
            <div className="space-y-2">
              <Badge className="rounded-full bg-primary/10 text-primary">管理後台</Badge>
              <p className="font-serif text-3xl text-foreground">品牌內容與商品維護</p>
              <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
                這個後台目前支援教練、課程、商品資料維護與圖片雲端上傳。建立資料後，公開首頁與商城頁會自動顯示最新內容。
              </p>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="coaches" className="space-y-6">
          <TabsList className="flex h-auto flex-wrap justify-start gap-2 rounded-[1.6rem] bg-secondary p-2">
            <TabsTrigger value="coaches" className="rounded-full px-5">教練</TabsTrigger>
            <TabsTrigger value="courses" className="rounded-full px-5">課程</TabsTrigger>
            <TabsTrigger value="products" className="rounded-full px-5">商品</TabsTrigger>
            <TabsTrigger value="orders" className="rounded-full px-5">訂單</TabsTrigger>
          </TabsList>

          <TabsContent value="coaches">
            <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
              <Card className="rounded-[2rem] border-border/70 bg-card/95">
                <CardContent className="space-y-4 p-6">
                  <p className="font-serif text-2xl text-foreground">現有教練</p>
                  {(dashboard.data?.coaches ?? []).map(coach => (
                    <button
                      key={coach.id}
                      className="w-full rounded-[1.4rem] border border-border/70 bg-background p-4 text-left transition hover:border-primary/40"
                      onClick={() =>
                        setCoachForm({
                          id: coach.id,
                          name: coach.name,
                          specialty: coach.specialty,
                          experience: coach.experience,
                          bio: coach.bio,
                          photoUrl: coach.photoUrl,
                          photoKey: coach.photoKey ?? undefined,
                          sortOrder: coach.sortOrder,
                          featured: coach.featured,
                          active: coach.active,
                        })
                      }
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-medium text-foreground">{coach.name}</p>
                          <p className="mt-1 text-sm text-muted-foreground">{coach.specialty}</p>
                        </div>
                        <Badge className="rounded-full bg-secondary text-secondary-foreground">
                          排序 {coach.sortOrder}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>

              <Card className="rounded-[2rem] border-border/70 bg-card/95">
                <CardContent className="space-y-5 p-7">
                  <p className="font-serif text-2xl text-foreground">教練編輯</p>
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-3">
                      <Label>姓名</Label>
                      <Input value={coachForm.name} onChange={e => setCoachForm(v => ({ ...v, name: e.target.value }))} />
                    </div>
                    <div className="space-y-3">
                      <Label>專長</Label>
                      <Input value={coachForm.specialty} onChange={e => setCoachForm(v => ({ ...v, specialty: e.target.value }))} />
                    </div>
                    <div className="space-y-3 md:col-span-2">
                      <Label>經歷</Label>
                      <Textarea value={coachForm.experience} onChange={e => setCoachForm(v => ({ ...v, experience: e.target.value }))} />
                    </div>
                    <div className="space-y-3 md:col-span-2">
                      <Label>介紹</Label>
                      <Textarea value={coachForm.bio} onChange={e => setCoachForm(v => ({ ...v, bio: e.target.value }))} />
                    </div>
                    <div className="space-y-3">
                      <Label>排序</Label>
                      <Input type="number" value={coachForm.sortOrder} onChange={e => setCoachForm(v => ({ ...v, sortOrder: Number(e.target.value) }))} />
                    </div>
                    <div className="space-y-3">
                      <Label>教練圖片</Label>
                      <Input type="file" accept="image/*" onChange={e => handleImageUpload(e, "coaches", result => setCoachForm(v => ({ ...v, photoUrl: result.url, photoKey: result.key })))} />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button className={coachForm.featured ? "rounded-full" : "rounded-full border border-border bg-background text-foreground hover:bg-secondary"} onClick={() => setCoachForm(v => ({ ...v, featured: !v.featured }))}>
                      {coachForm.featured ? "已設為精選教練" : "設為精選教練"}
                    </Button>
                    <Button className={coachForm.active ? "rounded-full" : "rounded-full border border-border bg-background text-foreground hover:bg-secondary"} onClick={() => setCoachForm(v => ({ ...v, active: !v.active }))}>
                      {coachForm.active ? "目前為上架顯示" : "目前為隱藏狀態"}
                    </Button>
                  </div>
                  {coachForm.photoUrl ? (
                    <img src={coachForm.photoUrl} alt="coach preview" className="h-56 w-full rounded-[1.6rem] object-cover" />
                  ) : null}
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={async () => {
                        try {
                          await saveCoach.mutateAsync(coachForm);
                          toast.success("教練資料已儲存");
                          setCoachForm(blankCoach);
                          await refreshDashboard();
                        } catch (error) {
                          toast.error(error instanceof Error ? error.message : "儲存失敗");
                        }
                      }}
                    >
                      儲存教練
                    </Button>
                    <Button className="rounded-full border border-border bg-background text-foreground hover:bg-secondary" onClick={() => setCoachForm(blankCoach)}>
                      清空表單
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="courses">
            <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
              <Card className="rounded-[2rem] border-border/70 bg-card/95">
                <CardContent className="space-y-4 p-6">
                  <p className="font-serif text-2xl text-foreground">現有課程</p>
                  {(dashboard.data?.courses ?? []).map(course => (
                    <button
                      key={course.id}
                      className="w-full rounded-[1.4rem] border border-border/70 bg-background p-4 text-left transition hover:border-primary/40"
                      onClick={() =>
                        setCourseForm({
                          id: course.id,
                          title: course.title,
                          courseType: course.courseType,
                          targetAudience: course.targetAudience,
                          summary: course.summary,
                          description: course.description,
                          highlight: course.highlight,
                          sortOrder: course.sortOrder,
                          featured: course.featured,
                          active: course.active,
                        })
                      }
                    >
                      <p className="font-medium text-foreground">{course.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{course.courseType}・{course.targetAudience}</p>
                    </button>
                  ))}
                </CardContent>
              </Card>

              <Card className="rounded-[2rem] border-border/70 bg-card/95">
                <CardContent className="space-y-5 p-7">
                  <p className="font-serif text-2xl text-foreground">課程編輯</p>
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-3">
                      <Label>課程名稱</Label>
                      <Input value={courseForm.title} onChange={e => setCourseForm(v => ({ ...v, title: e.target.value }))} />
                    </div>
                    <div className="space-y-3">
                      <Label>課程類型</Label>
                      <Input value={courseForm.courseType} onChange={e => setCourseForm(v => ({ ...v, courseType: e.target.value }))} />
                    </div>
                    <div className="space-y-3 md:col-span-2">
                      <Label>適合對象</Label>
                      <Input value={courseForm.targetAudience} onChange={e => setCourseForm(v => ({ ...v, targetAudience: e.target.value }))} />
                    </div>
                    <div className="space-y-3 md:col-span-2">
                      <Label>摘要</Label>
                      <Textarea value={courseForm.summary} onChange={e => setCourseForm(v => ({ ...v, summary: e.target.value }))} />
                    </div>
                    <div className="space-y-3 md:col-span-2">
                      <Label>亮點標語</Label>
                      <Input value={courseForm.highlight} onChange={e => setCourseForm(v => ({ ...v, highlight: e.target.value }))} />
                    </div>
                    <div className="space-y-3 md:col-span-2">
                      <Label>詳細描述</Label>
                      <Textarea value={courseForm.description} onChange={e => setCourseForm(v => ({ ...v, description: e.target.value }))} />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button className={courseForm.featured ? "rounded-full" : "rounded-full border border-border bg-background text-foreground hover:bg-secondary"} onClick={() => setCourseForm(v => ({ ...v, featured: !v.featured }))}>
                      {courseForm.featured ? "已設為精選課程" : "設為精選課程"}
                    </Button>
                    <Button className={courseForm.active ? "rounded-full" : "rounded-full border border-border bg-background text-foreground hover:bg-secondary"} onClick={() => setCourseForm(v => ({ ...v, active: !v.active }))}>
                      {courseForm.active ? "目前為上架顯示" : "目前為隱藏狀態"}
                    </Button>
                    <Button
                      onClick={async () => {
                        try {
                          await saveCourse.mutateAsync(courseForm);
                          toast.success("課程資料已儲存");
                          setCourseForm(blankCourse);
                          await refreshDashboard();
                        } catch (error) {
                          toast.error(error instanceof Error ? error.message : "儲存失敗");
                        }
                      }}
                    >
                      儲存課程
                    </Button>
                    <Button className="rounded-full border border-border bg-background text-foreground hover:bg-secondary" onClick={() => setCourseForm(blankCourse)}>
                      清空表單
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products">
            <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
              <Card className="rounded-[2rem] border-border/70 bg-card/95">
                <CardContent className="space-y-4 p-6">
                  <p className="font-serif text-2xl text-foreground">現有商品</p>
                  {(dashboard.data?.products ?? []).map(product => (
                    <button
                      key={product.id}
                      className="w-full rounded-[1.4rem] border border-border/70 bg-background p-4 text-left transition hover:border-primary/40"
                      onClick={() =>
                        setProductForm({
                          id: product.id,
                          name: product.name,
                          slug: product.slug,
                          category: product.category,
                          shortDescription: product.shortDescription,
                          description: product.description,
                          specs: product.specs,
                          priceCents: product.priceCents,
                          imageUrl: product.imageUrl,
                          imageKey: product.imageKey ?? undefined,
                          featured: product.featured,
                          active: product.active,
                          inventory: product.inventory,
                        })
                      }
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-medium text-foreground">{product.name}</p>
                          <p className="mt-1 text-sm text-muted-foreground">{product.category}</p>
                        </div>
                        <p className="text-sm font-medium text-foreground">{formatPrice(product.priceCents)}</p>
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>

              <Card className="rounded-[2rem] border-border/70 bg-card/95">
                <CardContent className="space-y-5 p-7">
                  <p className="font-serif text-2xl text-foreground">商品編輯</p>
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-3">
                      <Label>商品名稱</Label>
                      <Input value={productForm.name} onChange={e => setProductForm(v => ({ ...v, name: e.target.value }))} />
                    </div>
                    <div className="space-y-3">
                      <Label>Slug</Label>
                      <Input value={productForm.slug} onChange={e => setProductForm(v => ({ ...v, slug: e.target.value }))} placeholder="可留空，自動由名稱產生" />
                    </div>
                    <div className="space-y-3">
                      <Label>分類</Label>
                      <Input value={productForm.category} onChange={e => setProductForm(v => ({ ...v, category: e.target.value }))} />
                    </div>
                    <div className="space-y-3">
                      <Label>價格（分）</Label>
                      <Input type="number" value={productForm.priceCents} onChange={e => setProductForm(v => ({ ...v, priceCents: Number(e.target.value) }))} />
                    </div>
                    <div className="space-y-3">
                      <Label>庫存</Label>
                      <Input type="number" value={productForm.inventory} onChange={e => setProductForm(v => ({ ...v, inventory: Number(e.target.value) }))} />
                    </div>
                    <div className="space-y-3">
                      <Label>商品圖片</Label>
                      <Input type="file" accept="image/*" onChange={e => handleImageUpload(e, "products", result => setProductForm(v => ({ ...v, imageUrl: result.url, imageKey: result.key })))} />
                    </div>
                    <div className="space-y-3 md:col-span-2">
                      <Label>短描述</Label>
                      <Textarea value={productForm.shortDescription} onChange={e => setProductForm(v => ({ ...v, shortDescription: e.target.value }))} />
                    </div>
                    <div className="space-y-3 md:col-span-2">
                      <Label>詳細描述</Label>
                      <Textarea value={productForm.description} onChange={e => setProductForm(v => ({ ...v, description: e.target.value }))} />
                    </div>
                    <div className="space-y-3 md:col-span-2">
                      <Label>規格資訊（每行一項）</Label>
                      <Textarea value={productForm.specs} onChange={e => setProductForm(v => ({ ...v, specs: e.target.value }))} />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button className={productForm.featured ? "rounded-full" : "rounded-full border border-border bg-background text-foreground hover:bg-secondary"} onClick={() => setProductForm(v => ({ ...v, featured: !v.featured }))}>
                      {productForm.featured ? "已設為精選商品" : "設為精選商品"}
                    </Button>
                    <Button className={productForm.active ? "rounded-full" : "rounded-full border border-border bg-background text-foreground hover:bg-secondary"} onClick={() => setProductForm(v => ({ ...v, active: !v.active }))}>
                      {productForm.active ? "目前為上架顯示" : "目前為隱藏狀態"}
                    </Button>
                  </div>
                  {productForm.imageUrl ? (
                    <img src={productForm.imageUrl} alt="product preview" className="h-56 w-full rounded-[1.6rem] object-cover" />
                  ) : null}
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={async () => {
                        try {
                          await saveProduct.mutateAsync(productForm);
                          toast.success("商品資料已儲存");
                          setProductForm(blankProduct);
                          await refreshDashboard();
                        } catch (error) {
                          toast.error(error instanceof Error ? error.message : "儲存失敗");
                        }
                      }}
                    >
                      儲存商品
                    </Button>
                    <Button className="rounded-full border border-border bg-background text-foreground hover:bg-secondary" onClick={() => setProductForm(blankProduct)}>
                      清空表單
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <Card className="rounded-[2rem] border-border/70 bg-card/95">
              <CardContent className="space-y-5 p-7">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-serif text-2xl text-foreground">訂單列表</p>
                    <p className="text-sm leading-7 text-muted-foreground">
                      目前非金流版本會建立 pending_payment 狀態訂單，後續可直接銜接 Stripe 成功付款後的狀態更新流程。
                    </p>
                  </div>
                  <Badge className="rounded-full bg-secondary text-secondary-foreground">
                    {dashboard.data?.orders.length ?? 0} 筆
                  </Badge>
                </div>

                <div className="space-y-4">
                  {(dashboard.data?.orders ?? []).map(order => {
                    const items = (() => {
                      try {
                        return JSON.parse(order.itemsSnapshot) as Array<{ name: string; quantity: number }>;
                      } catch {
                        return [];
                      }
                    })();

                    return (
                      <div key={order.id} className="rounded-[1.6rem] border border-border/70 bg-background p-5">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <p className="font-medium text-foreground">{order.orderNumber}</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {order.customerName} ・ {order.customerEmail} ・ {order.customerPhone}
                            </p>
                          </div>
                          <div className="text-right space-y-2">
                            <Badge className="rounded-full bg-primary/10 text-primary">{order.status}</Badge>
                            <Badge className="ml-2 rounded-full bg-secondary text-secondary-foreground">通知：{order.notificationStatus}</Badge>
                            <p className="text-sm font-medium text-foreground">{formatPrice(order.subtotalCents)}</p>
                          </div>
                        </div>
                        {order.notificationError ? (
                          <p className="mt-4 text-sm text-destructive">通知失敗原因：{order.notificationError}</p>
                        ) : null}
                        <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
                          {items.map(item => (
                            <p key={`${order.id}-${item.name}`}>{item.name} × {item.quantity}</p>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
