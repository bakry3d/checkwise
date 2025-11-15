import {
  users,
  checks,
  type User,
  type UpsertUser,
  type Check,
  type InsertCheck,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserCredits(userId: string, creditsRemaining: number): Promise<User>;
  updateUserPlan(
    userId: string,
    planType: string,
    creditsTotal: number,
    creditsRemaining: number
  ): Promise<User>;

  // Check operations
  createCheck(check: InsertCheck): Promise<Check>;
  getCheck(id: string): Promise<Check | undefined>;
  getUserChecks(userId: string, limit?: number): Promise<Check[]>;
  getAllUserChecks(userId: string): Promise<Check[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserCredits(
    userId: string,
    creditsRemaining: number
  ): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        creditsRemaining,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUserPlan(
    userId: string,
    planType: string,
    creditsTotal: number,
    creditsRemaining: number
  ): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        planType,
        creditsTotal,
        creditsRemaining,
        creditsResetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Check operations
  async createCheck(checkData: InsertCheck): Promise<Check> {
    const [check] = await db.insert(checks).values(checkData).returning();
    return check;
  }

  async getCheck(id: string): Promise<Check | undefined> {
    const [check] = await db.select().from(checks).where(eq(checks.id, id));
    return check;
  }

  async getUserChecks(userId: string, limit: number = 10): Promise<Check[]> {
    return await db
      .select()
      .from(checks)
      .where(eq(checks.userId, userId))
      .orderBy(desc(checks.createdAt))
      .limit(limit);
  }

  async getAllUserChecks(userId: string): Promise<Check[]> {
    return await db
      .select()
      .from(checks)
      .where(eq(checks.userId, userId))
      .orderBy(desc(checks.createdAt));
  }
}

export const storage = new DatabaseStorage();
