import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  decimal,
  text,
  date,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Domains table for user's domain portfolio
export const domains = pgTable("domains", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  domainName: varchar("domain_name").notNull(),
  tld: varchar("tld").notNull(),
  registrar: varchar("registrar").notNull(),
  expiryDate: date("expiry_date").notNull(),
  renewalPrice: decimal("renewal_price", { precision: 10, scale: 2 }),
  privacyCost: decimal("privacy_cost", { precision: 10, scale: 2 }),
  lastChecked: timestamp("last_checked").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Registrar pricing table for comparison
export const registrarPrices = pgTable("registrar_prices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  registrar: varchar("registrar").notNull(),
  tld: varchar("tld").notNull(),
  renewalPrice: decimal("renewal_price", { precision: 10, scale: 2 }).notNull(),
  privacyPrice: decimal("privacy_price", { precision: 10, scale: 2 }),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const upsertUserSchema = insertUserSchema.extend({
  id: z.string(),
});

export const insertDomainSchema = createInsertSchema(domains).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastChecked: true,
});

export const insertRegistrarPriceSchema = createInsertSchema(registrarPrices).omit({
  id: true,
  lastUpdated: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertDomain = z.infer<typeof insertDomainSchema>;
export type Domain = typeof domains.$inferSelect;
export type InsertRegistrarPrice = z.infer<typeof insertRegistrarPriceSchema>;
export type RegistrarPrice = typeof registrarPrices.$inferSelect;

// Domain with comparison data type
export type DomainWithComparison = Domain & {
  bestPrice?: string;
  bestRegistrar?: string;
  savings?: string;
  savingsAmount?: number;
};
