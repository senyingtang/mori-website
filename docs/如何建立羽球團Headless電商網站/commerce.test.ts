import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const listPublicCoaches = vi.fn();
const listPublicCourses = vi.fn();
const listFeaturedProducts = vi.fn();
const listPublicProducts = vi.fn();
const getProductBySlug = vi.fn();
const listAdminCoaches = vi.fn();
const listAdminCourses = vi.fn();
const listAdminProducts = vi.fn();
const listOrders = vi.fn();
const createOrder = vi.fn();
const updateOrderNotificationStatus = vi.fn();
const upsertCoach = vi.fn();
const upsertCourse = vi.fn();
const upsertProduct = vi.fn();
const storagePut = vi.fn();
const notifyOwner = vi.fn();

vi.mock("./db", () => ({
  listPublicCoaches,
  listPublicCourses,
  listFeaturedProducts,
  listPublicProducts,
  getProductBySlug,
  listAdminCoaches,
  listAdminCourses,
  listAdminProducts,
  listOrders,
  createOrder,
  updateOrderNotificationStatus,
  upsertCoach,
  upsertCourse,
  upsertProduct,
}));

vi.mock("./storage", () => ({
  storagePut,
}));

vi.mock("./_core/notification", () => ({
  notifyOwner,
}));

const { appRouter } = await import("./routers");

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createContext(user: TrpcContext["user"] = null): TrpcContext {
  return {
    user,
    req: {
      protocol: "https",
      headers: {
        origin: "https://example.com",
      },
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as TrpcContext["res"],
  };
}

function createUser(role: AuthenticatedUser["role"]): AuthenticatedUser {
  return {
    id: role === "admin" ? 1 : 2,
    openId: `${role}-open-id`,
    email: `${role}@example.com`,
    name: role === "admin" ? "Admin" : "User",
    loginMethod: "manus",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
}

describe("storefront and commerce router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns homepage content from the content source", async () => {
    listPublicCoaches.mockResolvedValue([{ id: 1, name: "Coach A" }]);
    listPublicCourses.mockResolvedValue([{ id: 1, title: "Course A" }]);
    listFeaturedProducts.mockResolvedValue([{ id: 1, name: "Product A" }]);

    const caller = appRouter.createCaller(createContext());
    const result = await caller.site.home();

    expect(result.brand.name).toBe("Crown Baseball Club");
    expect(result.coaches).toHaveLength(1);
    expect(result.courses).toHaveLength(1);
    expect(result.featuredProducts).toHaveLength(1);
  });

  it("creates a pending-payment order based on catalog pricing", async () => {
    listPublicProducts.mockResolvedValue([
      {
        id: 11,
        name: "Crown Pro 訓練球衣",
        slug: "crown-pro-jersey",
        priceCents: 228000,
      },
      {
        id: 12,
        name: "Velvet Grip 打擊手套",
        slug: "velvet-grip-batting-gloves",
        priceCents: 168000,
      },
    ]);
    createOrder.mockResolvedValue("CBC-0000000001");
    updateOrderNotificationStatus.mockResolvedValue(undefined);
    notifyOwner.mockResolvedValue(true);

    const caller = appRouter.createCaller(createContext(createUser("user")));
    const result = await caller.order.create({
      customerName: "王小明",
      customerEmail: "buyer@example.com",
      customerPhone: "0912345678",
      items: [
        { productId: 11, quantity: 2 },
        { productId: 12, quantity: 1 },
      ],
    });

    expect(result.success).toBe(true);
    expect(result.status).toBe("pending_payment");
    expect(result.subtotalCents).toBe(624000);
    expect(createOrder).toHaveBeenCalledWith(
      expect.objectContaining({
        customerUserId: 2,
        customerName: "王小明",
        subtotalCents: 624000,
        status: "pending_payment",
        notificationStatus: "pending",
      }),
    );
    expect(updateOrderNotificationStatus).toHaveBeenCalledWith(
      expect.any(String),
      "sent",
      null,
    );
    expect(notifyOwner).toHaveBeenCalledTimes(1);
  });

  it("rejects order creation when requested quantity exceeds stock", async () => {
    listPublicProducts.mockResolvedValue([
      {
        id: 11,
        name: "Crown Pro 訓練球衣",
        slug: "crown-pro-jersey",
        priceCents: 228000,
        inventory: 1,
      },
    ]);

    const caller = appRouter.createCaller(createContext(createUser("user")));

    await expect(
      caller.order.create({
        customerName: "王小明",
        customerEmail: "buyer@example.com",
        customerPhone: "0912345678",
        items: [{ productId: 11, quantity: 2 }],
      }),
    ).rejects.toThrow("庫存不足");
  });

  it("allows admin users to save product content", async () => {
    upsertProduct.mockResolvedValue(undefined);

    const caller = appRouter.createCaller(createContext(createUser("admin")));
    const result = await caller.admin.saveProduct({
      name: "Royal Mark 棒球帽",
      category: "服飾",
      shortDescription: "低調高級感的球團識別棒球帽。",
      description: "採用立體刺繡與硬挺帽型，兼具日常穿搭與球場辨識度。",
      specs: "尺寸：可調式",
      priceCents: 128000,
      imageUrl: "/manus-storage/sample-cap.png",
      inventory: 8,
      featured: true,
      active: true,
    });

    expect(result).toEqual({ success: true });
    expect(upsertProduct).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Royal Mark 棒球帽",
        featured: true,
        active: true,
      }),
    );
  });

  it("blocks non-admin users from opening the admin dashboard", async () => {
    const caller = appRouter.createCaller(createContext(createUser("user")));

    await expect(caller.admin.dashboard()).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
  });
});
