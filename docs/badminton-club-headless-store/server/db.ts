import { and, asc, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  Coach,
  coaches,
  Course,
  courses,
  InsertCoach,
  InsertCourse,
  InsertOrder,
  InsertProduct,
  InsertUser,
  Order,
  orders,
  Product,
  products,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;
let seedPromise: Promise<void> | null = null;

function svgPlaceholder(title: string, subtitle: string, start: string, end: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${start}" />
          <stop offset="100%" stop-color="${end}" />
        </linearGradient>
      </defs>
      <rect width="1200" height="900" fill="url(#g)" rx="48" />
      <circle cx="980" cy="140" r="180" fill="rgba(255,255,255,0.12)" />
      <circle cx="180" cy="760" r="140" fill="rgba(255,255,255,0.1)" />
      <text x="90" y="380" fill="#f8f4ec" font-size="84" font-family="Georgia, serif" font-weight="700">${title}</text>
      <text x="92" y="455" fill="#f8f4ec" font-size="34" font-family="Arial, sans-serif" opacity="0.88">${subtitle}</text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const fallbackCoaches: InsertCoach[] = [
  {
    name: "林曜廷",
    specialty: "打擊訓練・比賽策略・青少年養成",
    experience: "前甲組選手，具 12 年訓練與賽事帶隊經驗。",
    bio: "擅長從基礎動作修正到實戰對決思維建立，重視節奏、判斷與穩定輸出。",
    photoUrl: svgPlaceholder("Coach Lin", "Elite Hitting Coach", "#31241f", "#8f6b4f"),
    sortOrder: 1,
    featured: true,
    active: true,
  },
  {
    name: "陳冠宇",
    specialty: "守備腳步・傳接節奏・內野判斷",
    experience: "曾任高中與大專校隊守備教練，長期協助球員建立防守穩定度。",
    bio: "以高密度腳步模組與情境式訓練聞名，能有效提升防守反應與團隊溝通。",
    photoUrl: svgPlaceholder("Coach Chen", "Defensive Precision", "#1f2b35", "#56718a"),
    sortOrder: 2,
    featured: true,
    active: true,
  },
  {
    name: "許以恩",
    specialty: "投手機制・球速提升・恢復管理",
    experience: "專注投手養成與週期化訓練規劃，熟悉不同年齡層投手負荷控管。",
    bio: "結合投球機制分析與恢復節奏安排，幫助投手兼顧效率、球質與身體健康。",
    photoUrl: svgPlaceholder("Coach Hsu", "Pitching Performance", "#1e2331", "#6d4f78"),
    sortOrder: 3,
    featured: true,
    active: true,
  },
];

const fallbackCourses: InsertCourse[] = [
  {
    title: "菁英打擊養成班",
    courseType: "分齡團體課",
    targetAudience: "國小高年級至高中球員",
    summary: "以打擊機制、擊球點判讀與比賽應變為核心的進階訓練。",
    description: "課程結合動作拆解、球路辨識與模擬實戰回合，協助球員建立可持續複製的打擊輸出。",
    highlight: "從基本機制到實戰決策完整串聯",
    sortOrder: 1,
    featured: true,
    active: true,
  },
  {
    title: "內野守備節奏課",
    courseType: "小班技術課",
    targetAudience: "希望提升接傳效率的內野手",
    summary: "針對起步、接球、轉傳與雙殺節奏建立穩定守備習慣。",
    description: "透過大量節奏訓練與真實球路處理，讓球員在高壓情境下仍能做出正確守備選擇。",
    highlight: "強化腳步速度與傳接一致性",
    sortOrder: 2,
    featured: true,
    active: true,
  },
  {
    title: "投手專項強化計畫",
    courseType: "一對一專訓",
    targetAudience: "需要提升球速、控球或身體協調的投手",
    summary: "依投手類型建立機制修正、球種優化與恢復週期安排。",
    description: "課程以投球動作效率、下肢發力與出手穩定為主軸，結合階段性訓練目標追蹤。",
    highlight: "兼顧表現提升與疲勞管理",
    sortOrder: 3,
    featured: true,
    active: true,
  },
];

const fallbackProducts: InsertProduct[] = [
  {
    name: "Crown Pro 訓練球衣",
    slug: "crown-pro-jersey",
    category: "服飾",
    shortDescription: "剪裁俐落、吸濕快乾的球團自創品牌訓練球衣。",
    description: "以高端球隊識別為靈感，採用輕量面料與俐落版型，適合日常訓練與活動穿搭。",
    specs: "尺寸：S / M / L / XL\n材質：聚酯纖維混紡\n特色：快乾、透氣、品牌刺繡",
    priceCents: 228000,
    imageUrl: svgPlaceholder("Crown Pro", "Signature Jersey", "#241d19", "#9b775a"),
    featured: true,
    active: true,
    inventory: 32,
  },
  {
    name: "Velvet Grip 打擊手套",
    slug: "velvet-grip-batting-gloves",
    category: "配件",
    shortDescription: "兼顧止滑與觸感的高質感打擊手套。",
    description: "手掌止滑材質與手背彈性結構兼顧包覆與靈活性，適合高頻率打擊練習與比賽使用。",
    specs: "尺寸：S / M / L\n顏色：象牙白 / 夜幕黑\n特色：止滑掌面、透氣孔設計",
    priceCents: 168000,
    imageUrl: svgPlaceholder("Velvet Grip", "Batting Gloves", "#202632", "#596b84"),
    featured: true,
    active: true,
    inventory: 48,
  },
  {
    name: "Field Line 球隊後背包",
    slug: "field-line-backpack",
    category: "裝備",
    shortDescription: "適合訓練與移動使用的多隔層品牌後背包。",
    description: "收納球衣、手套、水瓶與個人物品更有效率，外型簡潔並具備球隊識別細節。",
    specs: "容量：28L\n材質：防潑水布料\n特色：獨立鞋袋、加厚背帶、筆電夾層",
    priceCents: 258000,
    imageUrl: svgPlaceholder("Field Line", "Team Backpack", "#172328", "#4c7464"),
    featured: true,
    active: true,
    inventory: 20,
  },
  {
    name: "Royal Mark 棒球帽",
    slug: "royal-mark-cap",
    category: "服飾",
    shortDescription: "低調高級感的球團識別棒球帽。",
    description: "採用立體刺繡與硬挺帽型，兼具日常穿搭與球場辨識度。",
    specs: "尺寸：可調式\n材質：棉質混紡\n特色：立體刺繡、硬挺帽型",
    priceCents: 128000,
    imageUrl: svgPlaceholder("Royal Mark", "Signature Cap", "#2a1d1b", "#7b5551"),
    featured: false,
    active: true,
    inventory: 61,
  },
];

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

async function ensureSeedContent() {
  if (seedPromise) {
    await seedPromise;
    return;
  }

  seedPromise = (async () => {
    const db = await getDb();
    if (!db) return;

    const existingCoaches = await db.select({ id: coaches.id }).from(coaches).limit(1);
    if (existingCoaches.length === 0) {
      await db.insert(coaches).values(fallbackCoaches);
    }

    const existingCourses = await db.select({ id: courses.id }).from(courses).limit(1);
    if (existingCourses.length === 0) {
      await db.insert(courses).values(fallbackCourses);
    }

    const existingProducts = await db.select({ id: products.id }).from(products).limit(1);
    if (existingProducts.length === 0) {
      await db.insert(products).values(fallbackProducts);
    }
  })();

  await seedPromise;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function listPublicCoaches(): Promise<Coach[]> {
  const db = await getDb();
  if (!db) return fallbackCoaches.map((item, index) => toCoachFallback(item, index + 1));
  await ensureSeedContent();
  return db
    .select()
    .from(coaches)
    .where(and(eq(coaches.active, true), eq(coaches.featured, true)))
    .orderBy(asc(coaches.sortOrder), asc(coaches.id));
}

export async function listPublicCourses(): Promise<Course[]> {
  const db = await getDb();
  if (!db) return fallbackCourses.map((item, index) => toCourseFallback(item, index + 1));
  await ensureSeedContent();
  return db
    .select()
    .from(courses)
    .where(and(eq(courses.active, true), eq(courses.featured, true)))
    .orderBy(asc(courses.sortOrder), asc(courses.id));
}

export async function listPublicProducts(category?: string): Promise<Product[]> {
  const db = await getDb();
  if (!db) {
    return fallbackProducts
      .map((item, index) => toProductFallback(item, index + 1))
      .filter(item => !category || item.category === category);
  }
  await ensureSeedContent();
  const filters = [eq(products.active, true)];
  if (category) {
    filters.push(eq(products.category, category));
  }
  return db
    .select()
    .from(products)
    .where(and(...filters))
    .orderBy(desc(products.featured), desc(products.createdAt));
}

export async function listFeaturedProducts(): Promise<Product[]> {
  const db = await getDb();
  if (!db) {
    return fallbackProducts
      .filter(item => item.featured)
      .map((item, index) => toProductFallback(item, index + 1));
  }
  await ensureSeedContent();
  return db
    .select()
    .from(products)
    .where(and(eq(products.active, true), eq(products.featured, true)))
    .orderBy(desc(products.createdAt))
    .limit(3);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const db = await getDb();
  if (!db) {
    return fallbackProducts
      .map((item, index) => toProductFallback(item, index + 1))
      .find(item => item.slug === slug);
  }
  await ensureSeedContent();
  const result = await db
    .select()
    .from(products)
    .where(and(eq(products.slug, slug), eq(products.active, true)))
    .limit(1);
  return result[0];
}

export async function listAdminCoaches(): Promise<Coach[]> {
  const db = await getDb();
  if (!db) return fallbackCoaches.map((item, index) => toCoachFallback(item, index + 1));
  await ensureSeedContent();
  return db.select().from(coaches).orderBy(asc(coaches.sortOrder), asc(coaches.id));
}

export async function listAdminCourses(): Promise<Course[]> {
  const db = await getDb();
  if (!db) return fallbackCourses.map((item, index) => toCourseFallback(item, index + 1));
  await ensureSeedContent();
  return db.select().from(courses).orderBy(asc(courses.sortOrder), asc(courses.id));
}

export async function listAdminProducts(): Promise<Product[]> {
  const db = await getDb();
  if (!db) return fallbackProducts.map((item, index) => toProductFallback(item, index + 1));
  await ensureSeedContent();
  return db.select().from(products).orderBy(desc(products.createdAt));
}

export async function listOrders(): Promise<Order[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders).orderBy(desc(orders.createdAt));
}

export async function upsertCoach(input: InsertCoach & { id?: number }) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database unavailable");
  }

  if (input.id) {
    const { id, ...values } = input;
    await db.update(coaches).set(values).where(eq(coaches.id, id));
    return;
  }

  await db.insert(coaches).values(input);
}

export async function upsertCourse(input: InsertCourse & { id?: number }) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database unavailable");
  }

  if (input.id) {
    const { id, ...values } = input;
    await db.update(courses).set(values).where(eq(courses.id, id));
    return;
  }

  await db.insert(courses).values(input);
}

export async function upsertProduct(input: InsertProduct & { id?: number }) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database unavailable");
  }

  if (input.id) {
    const { id, ...values } = input;
    await db.update(products).set(values).where(eq(products.id, id));
    return;
  }

  await db.insert(products).values(input);
}

export async function createOrder(input: InsertOrder) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database unavailable");
  }

  await db.insert(orders).values(input);
  return input.orderNumber;
}

export async function updateOrderNotificationStatus(
  orderNumber: string,
  status: "pending" | "sent" | "failed",
  error?: string | null,
) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database unavailable");
  }

  await db
    .update(orders)
    .set({
      notificationStatus: status,
      notificationError: error ?? null,
    })
    .where(eq(orders.orderNumber, orderNumber));
}

function toCoachFallback(item: InsertCoach, id: number): Coach {
  return {
    id,
    name: item.name,
    specialty: item.specialty,
    experience: item.experience,
    bio: item.bio,
    photoUrl: item.photoUrl,
    photoKey: item.photoKey ?? null,
    sortOrder: item.sortOrder ?? 0,
    featured: item.featured ?? false,
    active: item.active ?? true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function toCourseFallback(item: InsertCourse, id: number): Course {
  return {
    id,
    title: item.title,
    courseType: item.courseType,
    targetAudience: item.targetAudience,
    summary: item.summary,
    description: item.description,
    highlight: item.highlight,
    sortOrder: item.sortOrder ?? 0,
    featured: item.featured ?? false,
    active: item.active ?? true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function toProductFallback(item: InsertProduct, id: number): Product {
  return {
    id,
    name: item.name,
    slug: item.slug,
    category: item.category,
    shortDescription: item.shortDescription,
    description: item.description,
    specs: item.specs,
    priceCents: item.priceCents,
    imageUrl: item.imageUrl,
    imageKey: item.imageKey ?? null,
    featured: item.featured ?? false,
    active: item.active ?? true,
    inventory: item.inventory ?? 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
