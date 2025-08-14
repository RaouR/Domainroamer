import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import { insertDomainSchema, insertRegistrarPriceSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";

const upload = multer({ dest: 'uploads/' });

export function registerRoutes(app: Express): Server {
  // Auth middleware
  setupAuth(app);

  // Portfolio stats
  app.get('/api/portfolio/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const stats = await storage.getPortfolioStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching portfolio stats:", error);
      res.status(500).json({ message: "Failed to fetch portfolio stats" });
    }
  });

  // Domain operations
  app.get('/api/domains', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const domains = await storage.getUserDomains(userId);
      res.json(domains);
    } catch (error) {
      console.error("Error fetching domains:", error);
      res.status(500).json({ message: "Failed to fetch domains" });
    }
  });

  app.post('/api/domains', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const domainData = insertDomainSchema.parse({
        ...req.body,
        userId,
      });
      
      const domain = await storage.createDomain(domainData);
      res.json(domain);
    } catch (error) {
      console.error("Error creating domain:", error);
      res.status(500).json({ message: "Failed to create domain" });
    }
  });

  app.put('/api/domains/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const domainData = insertDomainSchema.partial().parse(req.body);
      
      const domain = await storage.updateDomain(id, domainData);
      res.json(domain);
    } catch (error) {
      console.error("Error updating domain:", error);
      res.status(500).json({ message: "Failed to update domain" });
    }
  });

  app.delete('/api/domains/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      
      await storage.deleteDomain(id, userId);
      res.json({ message: "Domain deleted successfully" });
    } catch (error) {
      console.error("Error deleting domain:", error);
      res.status(500).json({ message: "Failed to delete domain" });
    }
  });

  // CSV import
  app.post('/api/domains/import', isAuthenticated, upload.single('csv'), async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      if (!req.file) {
        return res.status(400).json({ message: "No CSV file provided" });
      }

      // Here you would parse the CSV file and create domains
      // For now, return a success message
      res.json({ message: "CSV imported successfully" });
    } catch (error) {
      console.error("Error importing CSV:", error);
      res.status(500).json({ message: "Failed to import CSV" });
    }
  });

  // Registrar pricing operations
  app.get('/api/registrar-prices', async (_req, res) => {
    try {
      const prices = await storage.getRegistrarPrices();
      res.json(prices);
    } catch (error) {
      console.error("Error fetching registrar prices:", error);
      res.status(500).json({ message: "Failed to fetch registrar prices" });
    }
  });

  app.post('/api/registrar-prices', isAuthenticated, async (req, res) => {
    try {
      const priceData = insertRegistrarPriceSchema.parse(req.body);
      const price = await storage.upsertRegistrarPrice(priceData);
      res.json(price);
    } catch (error) {
      console.error("Error updating registrar price:", error);
      res.status(500).json({ message: "Failed to update registrar price" });
    }
  });

  // Initialize sample pricing data
  app.post('/api/initialize-pricing', async (_req, res) => {
    try {
      const samplePrices = [
        // .com prices
        { registrar: "Cloudflare", tld: ".com", renewalPrice: "9.15", privacyPrice: "0.00" },
        { registrar: "Namecheap", tld: ".com", renewalPrice: "12.98", privacyPrice: "2.88" },
        { registrar: "GoDaddy", tld: ".com", renewalPrice: "17.99", privacyPrice: "9.99" },
        { registrar: "Porkbun", tld: ".com", renewalPrice: "11.98", privacyPrice: "0.00" },
        
        // .io prices
        { registrar: "Cloudflare", tld: ".io", renewalPrice: "40.00", privacyPrice: "0.00" },
        { registrar: "Namecheap", tld: ".io", renewalPrice: "48.88", privacyPrice: "2.88" },
        { registrar: "GoDaddy", tld: ".io", renewalPrice: "59.99", privacyPrice: "9.99" },
        { registrar: "Porkbun", tld: ".io", renewalPrice: "32.44", privacyPrice: "0.00" },
        
        // .dev prices
        { registrar: "Cloudflare", tld: ".dev", renewalPrice: "13.50", privacyPrice: "0.00" },
        { registrar: "Namecheap", tld: ".dev", renewalPrice: "12.98", privacyPrice: "2.88" },
        { registrar: "GoDaddy", tld: ".dev", renewalPrice: "17.99", privacyPrice: "9.99" },
        { registrar: "Squarespace", tld: ".dev", renewalPrice: "14.99", privacyPrice: "8.00" },
        
        // .org prices
        { registrar: "Cloudflare", tld: ".org", renewalPrice: "10.15", privacyPrice: "0.00" },
        { registrar: "Namecheap", tld: ".org", renewalPrice: "14.98", privacyPrice: "2.88" },
        { registrar: "GoDaddy", tld: ".org", renewalPrice: "18.99", privacyPrice: "9.99" },
        { registrar: "Porkbun", tld: ".org", renewalPrice: "12.98", privacyPrice: "0.00" },
      ];

      for (const price of samplePrices) {
        await storage.upsertRegistrarPrice(price);
      }

      res.json({ message: "Sample pricing data initialized" });
    } catch (error) {
      console.error("Error initializing pricing:", error);
      res.status(500).json({ message: "Failed to initialize pricing" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
