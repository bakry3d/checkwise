import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { analyzeProduct, scrapeProductData } from "./openai";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Product check endpoints
  const checkSchema = z.object({
    productUrl: z.string().url(),
    platform: z.string(),
  });

  app.post("/api/checks", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if user has credits
      if (user.creditsRemaining <= 0) {
        return res.status(403).json({
          message: "No credits remaining. Please upgrade your plan.",
        });
      }

      // Validate request
      const validated = checkSchema.parse(req.body);

      // Scrape product data
      const scrapedData = await scrapeProductData(
        validated.productUrl,
        validated.platform
      );

      // Analyze with AI
      const analysis = await analyzeProduct({
        productName: scrapedData.productName,
        productPrice: scrapedData.productPrice,
        platform: validated.platform,
        reviewsSummary: scrapedData.reviewsSummary,
        productDescription: scrapedData.productDescription,
      });

      // Create check record
      const check = await storage.createCheck({
        userId,
        productUrl: validated.productUrl,
        productName: scrapedData.productName,
        productPrice: scrapedData.productPrice,
        productImage: scrapedData.productImage,
        platform: validated.platform,
        trustScore: analysis.trustScore,
        trustLevel: analysis.trustLevel,
        positivesPoints: analysis.positivePoints,
        negativePoints: analysis.negativePoints,
        recommendation: analysis.recommendation,
        aiAnalysis: analysis.aiAnalysis,
        alternatives: analysis.alternatives || [],
      });

      // Deduct credit
      await storage.updateUserCredits(userId, user.creditsRemaining - 1);

      res.json(check);
    } catch (error: any) {
      console.error("Error creating check:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data" });
      }
      res.status(500).json({ message: error.message || "Failed to check product" });
    }
  });

  app.get("/api/checks/recent", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const checks = await storage.getUserChecks(userId, 10);
      res.json(checks);
    } catch (error) {
      console.error("Error fetching recent checks:", error);
      res.status(500).json({ message: "Failed to fetch checks" });
    }
  });

  app.get("/api/checks", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const checks = await storage.getAllUserChecks(userId);
      res.json(checks);
    } catch (error) {
      console.error("Error fetching all checks:", error);
      res.status(500).json({ message: "Failed to fetch checks" });
    }
  });

  app.get("/api/checks/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const check = await storage.getCheck(req.params.id);

      if (!check) {
        return res.status(404).json({ message: "Check not found" });
      }

      // Verify ownership
      if (check.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json(check);
    } catch (error) {
      console.error("Error fetching check:", error);
      res.status(500).json({ message: "Failed to fetch check" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
