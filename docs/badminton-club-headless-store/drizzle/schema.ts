import {
  boolean,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const coaches = mysqlTable("coaches", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  specialty: varchar("specialty", { length: 255 }).notNull(),
  experience: text("experience").notNull(),
  bio: text("bio").notNull(),
  photoUrl: text("photoUrl").notNull(),
  photoKey: varchar("photoKey", { length: 255 }),
  sortOrder: int("sortOrder").default(0).notNull(),
  featured: boolean("featured").default(false).notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const courses = mysqlTable("courses", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 180 }).notNull(),
  courseType: varchar("courseType", { length: 120 }).notNull(),
  targetAudience: varchar("targetAudience", { length: 180 }).notNull(),
  summary: text("summary").notNull(),
  description: text("description").notNull(),
  highlight: varchar("highlight", { length: 180 }).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  featured: boolean("featured").default(false).notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 180 }).notNull(),
  slug: varchar("slug", { length: 191 }).notNull().unique(),
  category: varchar("category", { length: 120 }).notNull(),
  shortDescription: text("shortDescription").notNull(),
  description: text("description").notNull(),
  specs: text("specs").notNull(),
  priceCents: int("priceCents").notNull(),
  imageUrl: text("imageUrl").notNull(),
  imageKey: varchar("imageKey", { length: 255 }),
  featured: boolean("featured").default(false).notNull(),
  active: boolean("active").default(true).notNull(),
  inventory: int("inventory").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const orderStatusEnum = mysqlEnum("orderStatus", [
  "pending_payment",
  "processing",
  "completed",
  "cancelled",
]);

export const notificationStatusEnum = mysqlEnum("notificationStatus", [
  "pending",
  "sent",
  "failed",
]);

export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  orderNumber: varchar("orderNumber", { length: 64 }).notNull().unique(),
  customerUserId: int("customerUserId"),
  customerName: varchar("customerName", { length: 160 }).notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }).notNull(),
  customerPhone: varchar("customerPhone", { length: 40 }).notNull(),
  note: text("note"),
  status: orderStatusEnum.default("pending_payment").notNull(),
  subtotalCents: int("subtotalCents").notNull(),
  itemsSnapshot: text("itemsSnapshot").notNull(),
  notificationStatus: notificationStatusEnum.default("pending").notNull(),
  notificationError: text("notificationError"),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 128 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type Coach = typeof coaches.$inferSelect;
export type InsertCoach = typeof coaches.$inferInsert;

export type Course = typeof courses.$inferSelect;
export type InsertCourse = typeof courses.$inferInsert;

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;
