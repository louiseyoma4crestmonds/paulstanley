import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  verificationCode: text("verification_code"),
  isAdmin: boolean("is_admin").default(false).notNull(),
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const causes = pgTable("causes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  goal: decimal("goal", { precision: 10, scale: 2 }).notNull(),
  raised: decimal("raised", { precision: 10, scale: 2 }).default("0").notNull(),
  image: text("image").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  date: timestamp("date").notNull(),
  location: text("location").notNull(),
  image: text("image").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  image: text("image").notNull(),
  stock: integer("stock").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  itemId: varchar("item_id"),
  itemName: text("item_name").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").default("completed").notNull(),
  paymentMethod: text("payment_method").notNull(),
  paypalOrderId: text("paypal_order_id"),
  cryptoTxHash: text("crypto_tx_hash"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const meetGreetRequests = pgTable("meet_greet_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  preferredDate: timestamp("preferred_date"),
  location: text("location"),
  platform: text("platform"),
  message: text("message").notNull(),
  status: text("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const promoCodes = pgTable("promo_codes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: text("code").notNull().unique(),
  type: text("type").notNull(),
  used: boolean("used").default(false).notNull(),
  usedBy: varchar("used_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
}).extend({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2),
});

export const insertCauseSchema = createInsertSchema(causes).omit({
  id: true,
  createdAt: true,
  raised: true,
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
}).extend({
  date: z.coerce.date(),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export const insertMeetGreetRequestSchema = createInsertSchema(meetGreetRequests).omit({
  id: true,
  createdAt: true,
  status: true,
});

export const insertPromoCodeSchema = createInsertSchema(promoCodes).omit({
  id: true,
  createdAt: true,
  used: true,
  usedBy: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Cause = typeof causes.$inferSelect;
export type InsertCause = z.infer<typeof insertCauseSchema>;
export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type MeetGreetRequest = typeof meetGreetRequests.$inferSelect;
export type InsertMeetGreetRequest = z.infer<typeof insertMeetGreetRequestSchema>;
export type PromoCode = typeof promoCodes.$inferSelect;
export type InsertPromoCode = z.infer<typeof insertPromoCodeSchema>;
export type Setting = typeof settings.$inferSelect;
