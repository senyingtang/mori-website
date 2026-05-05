import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import {
  createOrder,
  getProductBySlug,
  listAdminCoaches,
  listAdminCourses,
  listAdminProducts,
  listFeaturedProducts,
  listOrders,
  listPublicCoaches,
  listPublicCourses,
  listPublicProducts,
  updateOrderNotificationStatus,
  upsertCoach,
  upsertCourse,
  upsertProduct,
} from "./db";
import { storagePut } from "./storage";
import { notifyOwner } from "./_core/notification";

const coachInput = z.object({
  id: z.number().int().positive().optional(),
  name: z.string().min(2).max(160),
  specialty: z.string().min(2).max(255),
  experience: z.string().min(10).max(3000),
  bio: z.string().min(10).max(3000),
  photoUrl: z.string().min(1),
  photoKey: z.string().max(255).optional().nullable(),
  sortOrder: z.number().int().min(0).default(0),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
});

const courseInput = z.object({
  id: z.number().int().positive().optional(),
  title: z.string().min(2).max(180),
  courseType: z.string().min(2).max(120),
  targetAudience: z.string().min(2).max(180),
  summary: z.string().min(10).max(3000),
  description: z.string().min(10).max(3000),
  highlight: z.string().min(2).max(180),
  sortOrder: z.number().int().min(0).default(0),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
});

const productInput = z.object({
  id: z.number().int().positive().optional(),
  name: z.string().min(2).max(180),
  slug: z.string().min(2).max(191).optional(),
  category: z.string().min(2).max(120),
  shortDescription: z.string().min(10).max(3000),
  description: z.string().min(10).max(6000),
  specs: z.string().min(5).max(4000),
  priceCents: z.number().int().min(0),
  imageUrl: z.string().min(1),
  imageKey: z.string().max(255).optional().nullable(),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
  inventory: z.number().int().min(0).default(0),
});

const uploadImageInput = z.object({
  filename: z.string().min(1).max(120),
  dataUrl: z.string().startsWith("data:image/"),
  folder: z.enum(["coaches", "products"]).default("products"),
});

const createOrderInput = z.object({
  customerName: z.string().min(2).max(160),
  customerEmail: z.email().max(320),
  customerPhone: z.string().min(6).max(40),
  note: z.string().max(2000).optional(),
  items: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().min(1).max(20),
      }),
    )
    .min(1),
});

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 191) || `product-${Date.now()}`;
}

function parseDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) {
    throw new Error("Unsupported image payload");
  }

  const [, mimeType, encoded] = match;
  return {
    mimeType,
    buffer: Buffer.from(encoded, "base64"),
  };
}

function sanitizeFilename(filename: string) {
  return filename.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  site: router({
    home: publicProcedure.query(async () => {
      const [coaches, courses, featuredProducts] = await Promise.all([
        listPublicCoaches(),
        listPublicCourses(),
        listFeaturedProducts(),
      ]);

      return {
        brand: {
          name: "Crown Baseball Club",
          tagline: "Precision. Heritage. Performance.",
          summary:
            "以高端球團品牌形象為核心，結合教練專業、課程設計與自創商品，打造兼具內容深度與購物體驗的官方網站。",
          primaryCta: "探索品牌商品",
          secondaryCta: "認識教練團隊",
        },
        coaches,
        courses,
        featuredProducts,
      };
    }),
  }),
  catalog: router({
    list: publicProcedure
      .input(
        z
          .object({
            category: z.string().min(1).optional(),
          })
          .optional(),
      )
      .query(async ({ input }) => {
        const products = await listPublicProducts(input?.category);
        const categories = Array.from(new Set(products.map(product => product.category)));
        return {
          products,
          categories,
        };
      }),
    bySlug: publicProcedure
      .input(z.object({ slug: z.string().min(1) }))
      .query(async ({ input }) => {
        const product = await getProductBySlug(input.slug);
        if (!product) {
          throw new Error("找不到商品");
        }
        return product;
      }),
  }),
  order: router({
    create: publicProcedure.input(createOrderInput).mutation(async ({ input, ctx }) => {
      const catalog = await listPublicProducts();
      const lines = input.items
        .map(item => {
          const product = catalog.find(candidate => candidate.id === item.productId);
          if (!product) {
            throw new Error("訂單中含有不存在的商品");
          }

          if (product.inventory < item.quantity) {
            throw new Error(`商品 ${product.name} 庫存不足`);
          }

          return {
            productId: product.id,
            name: product.name,
            slug: product.slug,
            quantity: item.quantity,
            unitPriceCents: product.priceCents,
            lineTotalCents: product.priceCents * item.quantity,
          };
        });

      const subtotalCents = lines.reduce((sum, item) => sum + item.lineTotalCents, 0);
      const orderNumber = `CBC-${Date.now().toString().slice(-10)}`;

      await createOrder({
        orderNumber,
        customerUserId: ctx.user?.id,
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerPhone: input.customerPhone,
        note: input.note ?? null,
        status: "pending_payment",
        subtotalCents,
        itemsSnapshot: JSON.stringify(lines),
        notificationStatus: "pending",
        notificationError: null,
        stripePaymentIntentId: null,
      });

      let notificationStatus: "pending" | "sent" | "failed" = "pending";
      let notificationError: string | null = null;

      try {
        const delivered = await notifyOwner({
          title: `新訂單 ${orderNumber}`,
          content: `${input.customerName} 建立了新訂單，金額為 NT$${(subtotalCents / 100).toLocaleString("zh-TW")}，目前狀態為 pending_payment。`,
        });

        notificationStatus = delivered ? "sent" : "failed";
        notificationError = delivered ? null : "通知服務暫時無法送達";
      } catch (error) {
        console.warn("[Order] Failed to notify owner", error);
        notificationStatus = "failed";
        notificationError = error instanceof Error ? error.message : "通知失敗";
      }

      await updateOrderNotificationStatus(orderNumber, notificationStatus, notificationError);

      return {
        success: true,
        orderNumber,
        subtotalCents,
        status: "pending_payment" as const,
        notificationStatus,
        notificationError,
      };
    }),
  }),
  media: router({
    uploadImage: adminProcedure.input(uploadImageInput).mutation(async ({ input }) => {
      const { mimeType, buffer } = parseDataUrl(input.dataUrl);
      const extension = mimeType.split("/")[1] || "png";
      const safeName = sanitizeFilename(input.filename.replace(/\.[^.]+$/, ""));
      const relKey = `${input.folder}/${Date.now()}-${safeName}.${extension}`;
      const uploaded = await storagePut(relKey, buffer, mimeType);
      return uploaded;
    }),
  }),
  admin: router({
    dashboard: adminProcedure.query(async () => {
      const [coaches, courses, products, orders] = await Promise.all([
        listAdminCoaches(),
        listAdminCourses(),
        listAdminProducts(),
        listOrders(),
      ]);

      return {
        coaches,
        courses,
        products,
        orders,
      };
    }),
    saveCoach: adminProcedure.input(coachInput).mutation(async ({ input }) => {
      await upsertCoach({
        id: input.id,
        name: input.name,
        specialty: input.specialty,
        experience: input.experience,
        bio: input.bio,
        photoUrl: input.photoUrl,
        photoKey: input.photoKey ?? null,
        sortOrder: input.sortOrder,
        featured: input.featured,
        active: input.active,
      });
      return { success: true };
    }),
    saveCourse: adminProcedure.input(courseInput).mutation(async ({ input }) => {
      await upsertCourse({
        id: input.id,
        title: input.title,
        courseType: input.courseType,
        targetAudience: input.targetAudience,
        summary: input.summary,
        description: input.description,
        highlight: input.highlight,
        sortOrder: input.sortOrder,
        featured: input.featured,
        active: input.active,
      });
      return { success: true };
    }),
    saveProduct: adminProcedure.input(productInput).mutation(async ({ input }) => {
      await upsertProduct({
        id: input.id,
        name: input.name,
        slug: slugify(input.slug || input.name),
        category: input.category,
        shortDescription: input.shortDescription,
        description: input.description,
        specs: input.specs,
        priceCents: input.priceCents,
        imageUrl: input.imageUrl,
        imageKey: input.imageKey ?? null,
        featured: input.featured,
        active: input.active,
        inventory: input.inventory,
      });
      return { success: true };
    }),
  }),
});

export type AppRouter = typeof appRouter;
