import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { scrapingService } from "./scrapers/scraping-service";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for fanfiction recommendation platform
  
  // Get all stories with optional filtering
  app.get("/api/stories", async (req, res) => {
    try {
      const { fandom, status, rating, wordCount, search } = req.query;
      
      const filters = {
        fandom: fandom as string,
        status: Array.isArray(status) ? status as string[] : status ? [status as string] : [],
        rating: Array.isArray(rating) ? rating as string[] : rating ? [rating as string] : [],
        wordCount: wordCount as string,
        search: search as string
      };
      
      const stories = await storage.getFilteredStories(filters);
      res.json(stories);
    } catch (error) {
      console.error('Error fetching stories:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get featured story
  app.get("/api/stories/featured", async (req, res) => {
    try {
      const story = await storage.getFeaturedStory();
      if (story) {
        res.json(story);
      } else {
        res.status(404).json({ message: "No featured story found" });
      }
    } catch (error) {
      console.error('Error fetching featured story:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get trending stories
  app.get("/api/stories/trending", async (req, res) => {
    try {
      const stories = await storage.getTrendingStories();
      res.json(stories);
    } catch (error) {
      console.error('Error fetching trending stories:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // User preferences endpoints (for future database integration)
  app.get("/api/user/preferences", async (req, res) => {
    try {
      res.json({ message: "User preferences handled by localStorage in frontend" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/user/preferences", async (req, res) => {
    try {
      res.json({ message: "User preferences handled by localStorage in frontend" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Scraping endpoints
  app.post("/api/scrape/popular", async (req, res) => {
    try {
      const { fandoms, limit = 20 } = req.body;
      await scrapingService.scrapeAndStoreStories(fandoms, limit);
      res.json({ 
        message: `Successfully scraped and stored popular stories${fandoms ? ` for fandoms: ${fandoms.join(', ')}` : ''}`,
        limit 
      });
    } catch (error) {
      console.error('Error scraping popular stories:', error);
      res.status(500).json({ message: "Failed to scrape stories", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.post("/api/scrape/search", async (req, res) => {
    try {
      const { query, limit = 20 } = req.body;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      await scrapingService.searchAndStoreStories(query, limit);
      res.json({ 
        message: `Successfully scraped and stored stories matching "${query}"`,
        query,
        limit 
      });
    } catch (error) {
      console.error('Error scraping search results:', error);
      res.status(500).json({ message: "Failed to scrape stories", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.post("/api/scrape/update-views", async (req, res) => {
    try {
      await scrapingService.updateWeeklyViews();
      res.json({ message: "Successfully updated weekly view counts" });
    } catch (error) {
      console.error('Error updating weekly views:', error);
      res.status(500).json({ message: "Failed to update weekly views", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.get("/api/scrape/sources", async (req, res) => {
    try {
      const sources = scrapingService.getAvailableSources();
      res.json({ sources });
    } catch (error) {
      console.error('Error getting scraping sources:', error);
      res.status(500).json({ message: "Failed to get sources", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
