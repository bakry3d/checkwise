import { sql } from "drizzle-orm";
import { 
  pgTable, 
  text, 
  varchar, 
  integer, 
  timestamp,
  boolean,
  jsonb,
  index
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table (Replit Auth compatible)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  
  // Subscription & Credits
  planType: varchar("plan_type").default("free"), // free, basic, standard, pro
  creditsRemaining: integer("credits_remaining").default(3),
  creditsTotal: integer("credits_total").default(3),
  creditsResetDate: timestamp("credits_reset_date"),
  
  // Stripe info
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  
  // Trial tracking
  trialStartDate: timestamp("trial_start_date"),
  trialChecksUsed: integer("trial_checks_used").default(0),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Product checks table
export const checks = pgTable("checks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  
  // Product info
  productUrl: text("product_url").notNull(),
  productName: text("product_name").notNull(),
  productPrice: text("product_price"),
  productImage: text("product_image"),
  platform: varchar("platform").notNull(), // amazon, temu, tiktok, aliexpress
  
  // Analysis results
  trustScore: integer("trust_score").notNull(), // 0-100
  trustLevel: varchar("trust_level").notNull(), // trusted, warning, untrusted
  positivesPoints: jsonb("positive_points").$type<string[]>().default([]),
  negativePoints: jsonb("negative_points").$type<string[]>().default([]),
  recommendation: text("recommendation").notNull(),
  aiAnalysis: text("ai_analysis"), // Full AI response
  
  // Alternatives (if any)
  alternatives: jsonb("alternatives").$type<{
    name: string;
    url: string;
    price: string;
    trustScore: number;
    savings: string;
    highlights: string[];
  }[]>().default([]),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export type InsertCheck = typeof checks.$inferInsert;
export type Check = typeof checks.$inferSelect;

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  checks: many(checks),
}));

export const checksRelations = relations(checks, ({ one }) => ({
  user: one(users, {
    fields: [checks.userId],
    references: [users.id],
  }),
}));

// Zod schemas for validation
export const insertCheckSchema = createInsertSchema(checks).omit({
  id: true,
  createdAt: true,
});

export type InsertCheckType = z.infer<typeof insertCheckSchema>;

// Plan configuration
export const PLANS = {
  free: {
    name: "تجربة مجانية",
    credits: 3,
    price: 0,
    duration: "مرة واحدة",
  },
  basic: {
    name: "Basic",
    credits: 10,
    price: 3.99,
    priceId: "price_basic", // Will be replaced with actual Stripe price ID
    duration: "شهرياً",
  },
  standard: {
    name: "Standard",
    credits: 30,
    price: 6.99,
    priceId: "price_standard",
    duration: "شهرياً",
    popular: true,
  },
  pro: {
    name: "Pro",
    credits: 100,
    price: 12.99,
    priceId: "price_pro",
    duration: "شهرياً",
  },
} as const;

export type PlanType = keyof typeof PLANS;
