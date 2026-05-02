import { 
  type User, 
  type InsertUser,
  type Cause,
  type InsertCause,
  type Event,
  type InsertEvent,
  type Product,
  type InsertProduct,
  type Transaction,
  type InsertTransaction,
  type MeetGreetRequest,
  type InsertMeetGreetRequest,
  type PromoCode,
  type InsertPromoCode,
} from "@shared/schema";
import { db } from "./db";
import { 
  users, 
  causes, 
  events, 
  products, 
  transactions, 
  meetGreetRequests,
  promoCodes,
} from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User | undefined>;
  
  getCauses(): Promise<Cause[]>;
  getCause(id: string): Promise<Cause | undefined>;
  createCause(cause: InsertCause): Promise<Cause>;
  updateCause(id: string, data: Partial<Cause>): Promise<Cause | undefined>;
  deleteCause(id: string): Promise<boolean>;
  
  getEvents(): Promise<Event[]>;
  getEvent(id: string): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: string, data: Partial<Event>): Promise<Event | undefined>;
  deleteEvent(id: string): Promise<boolean>;
  
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, data: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
  
  getTransactionsByUser(userId: string): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  deleteAdminGrantTransaction(userId: string, type: string): Promise<boolean>;
  
  getMeetGreetRequestsByUser(userId: string): Promise<MeetGreetRequest[]>;
  getAllMeetGreetRequests(): Promise<(MeetGreetRequest & { user: { fullName: string; email: string } | null })[]>;
  getAllLiveCallRequests(): Promise<(MeetGreetRequest & { user: { fullName: string; email: string } | null })[]>;
  createMeetGreetRequest(request: InsertMeetGreetRequest): Promise<MeetGreetRequest>;
  updateMeetGreetRequest(id: string, data: Partial<MeetGreetRequest>): Promise<MeetGreetRequest | undefined>;
  
  getPromoCode(code: string): Promise<PromoCode | undefined>;
  createPromoCode(promoCode: InsertPromoCode): Promise<PromoCode>;
  usePromoCode(code: string, userId: string): Promise<PromoCode | undefined>;
  
  getUserProgress(userId: string): Promise<{
    hasPromoCode: boolean;
    hasDonation: boolean;
    hasPurchase: boolean;
    hasLogisticsFee: boolean;
    progress: number;
  }>;
}

export class DbStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users).orderBy(desc(users.createdAt));
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | undefined> {
    const [user] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return user;
  }

  async getCauses(): Promise<Cause[]> {
    return db.select().from(causes).orderBy(desc(causes.createdAt));
  }

  async getCause(id: string): Promise<Cause | undefined> {
    const [cause] = await db.select().from(causes).where(eq(causes.id, id));
    return cause;
  }

  async createCause(insertCause: InsertCause): Promise<Cause> {
    const [cause] = await db.insert(causes).values(insertCause).returning();
    return cause;
  }

  async updateCause(id: string, data: Partial<Cause>): Promise<Cause | undefined> {
    const [cause] = await db.update(causes).set(data).where(eq(causes.id, id)).returning();
    return cause;
  }

  async deleteCause(id: string): Promise<boolean> {
    const result = await db.delete(causes).where(eq(causes.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getEvents(): Promise<Event[]> {
    return db.select().from(events).orderBy(events.date);
  }

  async getEvent(id: string): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const [event] = await db.insert(events).values(insertEvent).returning();
    return event;
  }

  async updateEvent(id: string, data: Partial<Event>): Promise<Event | undefined> {
    const [event] = await db.update(events).set(data).where(eq(events.id, id)).returning();
    return event;
  }

  async deleteEvent(id: string): Promise<boolean> {
    const result = await db.delete(events).where(eq(events.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getProducts(): Promise<Product[]> {
    return db.select().from(products).orderBy(desc(products.createdAt));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  async updateProduct(id: string, data: Partial<Product>): Promise<Product | undefined> {
    const [product] = await db.update(products).set(data).where(eq(products.id, id)).returning();
    return product;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getTransactionsByUser(userId: string): Promise<Transaction[]> {
    return db.select().from(transactions).where(eq(transactions.userId, userId)).orderBy(desc(transactions.createdAt));
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const [transaction] = await db.insert(transactions).values(insertTransaction).returning();
    return transaction;
  }

  async deleteAdminGrantTransaction(userId: string, type: string): Promise<boolean> {
    const result = await db
      .delete(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          eq(transactions.type, type),
          eq(transactions.paymentMethod, "admin_grant"),
        )
      );
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getMeetGreetRequestsByUser(userId: string): Promise<MeetGreetRequest[]> {
    return db.select().from(meetGreetRequests).where(eq(meetGreetRequests.userId, userId)).orderBy(desc(meetGreetRequests.createdAt));
  }

  async getAllMeetGreetRequests(): Promise<(MeetGreetRequest & { user: { fullName: string; email: string } | null })[]> {
    const rows = await db
      .select()
      .from(meetGreetRequests)
      .leftJoin(users, eq(meetGreetRequests.userId, users.id))
      .where(eq(meetGreetRequests.type, "meet_greet"))
      .orderBy(desc(meetGreetRequests.createdAt));
    return rows.map(r => ({
      ...r.meet_greet_requests,
      user: r.users ? { fullName: r.users.fullName, email: r.users.email } : null,
    }));
  }

  async getAllLiveCallRequests(): Promise<(MeetGreetRequest & { user: { fullName: string; email: string } | null })[]> {
    const rows = await db
      .select()
      .from(meetGreetRequests)
      .leftJoin(users, eq(meetGreetRequests.userId, users.id))
      .where(eq(meetGreetRequests.type, "live_call"))
      .orderBy(desc(meetGreetRequests.createdAt));
    return rows.map(r => ({
      ...r.meet_greet_requests,
      user: r.users ? { fullName: r.users.fullName, email: r.users.email } : null,
    }));
  }

  async createMeetGreetRequest(insertRequest: InsertMeetGreetRequest): Promise<MeetGreetRequest> {
    const [request] = await db.insert(meetGreetRequests).values(insertRequest).returning();
    return request;
  }

  async updateMeetGreetRequest(id: string, data: Partial<MeetGreetRequest>): Promise<MeetGreetRequest | undefined> {
    const [request] = await db.update(meetGreetRequests).set(data).where(eq(meetGreetRequests.id, id)).returning();
    return request;
  }

  async getPromoCode(code: string): Promise<PromoCode | undefined> {
    const [promoCode] = await db.select().from(promoCodes).where(eq(promoCodes.code, code));
    return promoCode;
  }

  async createPromoCode(insertPromoCode: InsertPromoCode): Promise<PromoCode> {
    const [promoCode] = await db.insert(promoCodes).values(insertPromoCode).returning();
    return promoCode;
  }

  async usePromoCode(code: string, userId: string): Promise<PromoCode | undefined> {
    const [promoCode] = await db
      .update(promoCodes)
      .set({ used: true, usedBy: userId })
      .where(and(eq(promoCodes.code, code), eq(promoCodes.used, false)))
      .returning();
    return promoCode;
  }

  async getUserProgress(userId: string): Promise<{
    hasPromoCode: boolean;
    hasDonation: boolean;
    hasPurchase: boolean;
    hasLogisticsFee: boolean;
    progress: number;
  }> {
    const userTransactions = await this.getTransactionsByUser(userId);
    
    const hasPromoCode = userTransactions.some(t => t.type === "promo_code" || t.type === "fan_card");
    const hasDonation = userTransactions.some(t => t.type === "donation");
    const hasPurchase = userTransactions.some(t => t.type === "product");
    const hasLogisticsFee = userTransactions.some(t => t.type === "logistics_fee");
    
    const completed = [hasPromoCode, hasDonation, hasPurchase, hasLogisticsFee].filter(Boolean).length;
    const progress = (completed / 4) * 100;
    
    return {
      hasPromoCode,
      hasDonation,
      hasPurchase,
      hasLogisticsFee,
      progress,
    };
  }
}

export const storage = new DbStorage();
