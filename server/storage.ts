import {
  users,
  domains,
  registrarPrices,
  type User,
  type UpsertUser,
  type Domain,
  type InsertDomain,
  type RegistrarPrice,
  type InsertRegistrarPrice,
  type DomainWithComparison,
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Domain operations
  getUserDomains(userId: string): Promise<DomainWithComparison[]>;
  createDomain(domain: InsertDomain): Promise<Domain>;
  updateDomain(id: string, domain: Partial<InsertDomain>): Promise<Domain>;
  deleteDomain(id: string, userId: string): Promise<void>;
  
  // Registrar pricing operations
  getRegistrarPrices(): Promise<RegistrarPrice[]>;
  getRegistrarPriceByTld(tld: string): Promise<RegistrarPrice[]>;
  upsertRegistrarPrice(price: InsertRegistrarPrice): Promise<RegistrarPrice>;
  
  // Portfolio stats
  getPortfolioStats(userId: string): Promise<{
    totalDomains: number;
    totalSavings: number;
    expiringSoon: number;
    registrarCount: number;
  }>;
}

export class DatabaseStorage implements IStorage {
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

  async getUserDomains(userId: string): Promise<DomainWithComparison[]> {
    const userDomains = await db
      .select()
      .from(domains)
      .where(eq(domains.userId, userId));

    // Calculate savings for each domain
    const domainsWithComparison: DomainWithComparison[] = [];
    
    for (const domain of userDomains) {
      const prices = await this.getRegistrarPriceByTld(domain.tld);
      
      if (prices.length === 0) {
        domainsWithComparison.push(domain);
        continue;
      }

      // Find cheapest option
      const cheapest = prices.reduce((min, current) => 
        parseFloat(current.renewalPrice) < parseFloat(min.renewalPrice) ? current : min
      );

      const currentPrice = parseFloat(domain.renewalPrice || '0');
      const bestPrice = parseFloat(cheapest.renewalPrice);
      const savingsAmount = currentPrice - bestPrice;

      domainsWithComparison.push({
        ...domain,
        bestPrice: `$${bestPrice.toFixed(2)}`,
        bestRegistrar: cheapest.registrar,
        savings: savingsAmount > 0 ? `$${savingsAmount.toFixed(2)}` : '$0.00',
        savingsAmount: Math.max(0, savingsAmount),
      });
    }

    return domainsWithComparison;
  }

  async createDomain(domain: InsertDomain): Promise<Domain> {
    const [newDomain] = await db
      .insert(domains)
      .values(domain)
      .returning();
    return newDomain;
  }

  async updateDomain(id: string, domain: Partial<InsertDomain>): Promise<Domain> {
    const [updatedDomain] = await db
      .update(domains)
      .set({ ...domain, updatedAt: new Date() })
      .where(eq(domains.id, id))
      .returning();
    return updatedDomain;
  }

  async deleteDomain(id: string, userId: string): Promise<void> {
    await db
      .delete(domains)
      .where(and(eq(domains.id, id), eq(domains.userId, userId)));
  }

  async getRegistrarPrices(): Promise<RegistrarPrice[]> {
    return await db.select().from(registrarPrices);
  }

  async getRegistrarPriceByTld(tld: string): Promise<RegistrarPrice[]> {
    return await db
      .select()
      .from(registrarPrices)
      .where(eq(registrarPrices.tld, tld));
  }

  async upsertRegistrarPrice(price: InsertRegistrarPrice): Promise<RegistrarPrice> {
    const [registrarPrice] = await db
      .insert(registrarPrices)
      .values(price)
      .onConflictDoUpdate({
        target: [registrarPrices.registrar, registrarPrices.tld],
        set: {
          ...price,
          lastUpdated: new Date(),
        },
      })
      .returning();
    return registrarPrice;
  }

  async getPortfolioStats(userId: string): Promise<{
    totalDomains: number;
    totalSavings: number;
    expiringSoon: number;
    registrarCount: number;
  }> {
    const userDomains = await this.getUserDomains(userId);
    const totalDomains = userDomains.length;
    const totalSavings = userDomains.reduce((sum, domain) => sum + (domain.savingsAmount || 0), 0);
    
    // Count domains expiring in next 30 days
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    const expiringSoon = userDomains.filter(domain => {
      const expiryDate = new Date(domain.expiryDate);
      return expiryDate <= thirtyDaysFromNow;
    }).length;

    const uniqueRegistrars = new Set(userDomains.map(domain => domain.registrar));
    const registrarCount = uniqueRegistrars.size;

    return {
      totalDomains,
      totalSavings,
      expiringSoon,
      registrarCount,
    };
  }
}

export const storage = new DatabaseStorage();
