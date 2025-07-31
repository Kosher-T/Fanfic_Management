import { stories, users, type User, type InsertUser, type Story, type InsertStory } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, like, gte, lte, or } from "drizzle-orm";

export interface IStorage {
  // Story operations
  getAllStories(): Promise<Story[]>;
  getStoryById(id: number): Promise<Story | undefined>;
  getFeaturedStory(): Promise<Story | undefined>;
  getTrendingStories(): Promise<Story[]>;
  getFilteredStories(filters: {
    fandom?: string;
    status?: string[];
    rating?: string[];
    wordCount?: string;
    search?: string;
  }): Promise<Story[]>;
  createStory(story: InsertStory): Promise<Story>;
  
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
}

export class DatabaseStorage implements IStorage {
  async getAllStories(): Promise<Story[]> {
    return await db.select().from(stories).orderBy(desc(stories.viewCount));
  }

  async getStoryById(id: number): Promise<Story | undefined> {
    const [story] = await db.select().from(stories).where(eq(stories.id, id));
    return story || undefined;
  }

  async getFeaturedStory(): Promise<Story | undefined> {
    const [story] = await db.select().from(stories).where(eq(stories.isFeatured, true));
    return story || undefined;
  }

  async getTrendingStories(): Promise<Story[]> {
    return await db.select().from(stories)
      .where(gte(stories.weeklyViews, 1))
      .orderBy(desc(stories.weeklyViews))
      .limit(3);
  }

  async getFilteredStories(filters: {
    fandom?: string;
    status?: string[];
    rating?: string[];
    wordCount?: string;
    search?: string;
  }): Promise<Story[]> {
    let query = db.select().from(stories);
    const conditions = [];

    // Exclude featured stories
    conditions.push(eq(stories.isFeatured, false));

    if (filters.fandom && filters.fandom !== 'All Fandoms') {
      conditions.push(eq(stories.fandom, filters.fandom));
    }

    if (filters.status && filters.status.length > 0) {
      const statusMap: { [key: string]: string } = {
        'Complete': 'complete',
        'In Progress': 'in-progress',
        'On Hiatus': 'on-hiatus'
      };
      const mappedStatuses = filters.status.map(s => statusMap[s]).filter(Boolean);
      if (mappedStatuses.length > 0) {
        conditions.push(or(...mappedStatuses.map(status => eq(stories.status, status as any))));
      }
    }

    if (filters.rating && filters.rating.length > 0) {
      const ratingConditions = [];
      if (filters.rating.includes('4+ Stars')) {
        ratingConditions.push(gte(stories.rating, '4'));
      }
      if (filters.rating.includes('3+ Stars')) {
        ratingConditions.push(gte(stories.rating, '3'));
      }
      if (ratingConditions.length > 0) {
        conditions.push(or(...ratingConditions));
      }
    }

    if (filters.wordCount && filters.wordCount !== 'any') {
      switch (filters.wordCount) {
        case 'short':
          conditions.push(lte(stories.wordCount, 10000));
          break;
        case 'medium':
          conditions.push(and(gte(stories.wordCount, 10000), lte(stories.wordCount, 50000)));
          break;
        case 'long':
          conditions.push(and(gte(stories.wordCount, 50000), lte(stories.wordCount, 100000)));
          break;
        case 'epic':
          conditions.push(gte(stories.wordCount, 100000));
          break;
      }
    }

    if (filters.search) {
      const searchTerm = `%${filters.search.toLowerCase()}%`;
      conditions.push(
        or(
          like(stories.title, searchTerm),
          like(stories.author, searchTerm),
          like(stories.summary, searchTerm),
          like(stories.fandom, searchTerm)
        )
      );
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query.orderBy(desc(stories.viewCount));
  }

  async createStory(story: InsertStory): Promise<Story> {
    const [newStory] = await db.insert(stories).values(story).returning();
    return newStory;
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
}

export const storage = new DatabaseStorage();
