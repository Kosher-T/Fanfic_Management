import { pgTable, text, integer, boolean, decimal, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Database Tables
export const stories = pgTable("stories", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  summary: text("summary").notNull(),
  fandom: text("fandom").notNull(),
  tags: text("tags").array().notNull(),
  rating: decimal("rating", { precision: 2, scale: 1 }).notNull(),
  wordCount: integer("word_count").notNull(),
  status: text("status", { enum: ["complete", "in-progress", "on-hiatus"] }).notNull(),
  lastUpdated: timestamp("last_updated").notNull(),
  source: text("source", { enum: ["AO3", "FFN", "SpaceBattles", "Sufficient Velocity"] }).notNull(),
  viewCount: integer("view_count").default(0),
  weeklyViews: integer("weekly_views").default(0),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  theme: text("theme", { enum: ["light", "dark"] }).default("dark"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const bookmarks = pgTable("bookmarks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  storyId: integer("story_id").references(() => stories.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Zod Schemas
export const insertStorySchema = createInsertSchema(stories).omit({
  id: true,
  createdAt: true,
});

export const selectStorySchema = createSelectSchema(stories);

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const selectUserSchema = createSelectSchema(users);

// Types
export type Story = typeof stories.$inferSelect;
export type InsertStory = typeof stories.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Bookmark = typeof bookmarks.$inferSelect;
export type InsertBookmark = typeof bookmarks.$inferInsert;

// Client-side schemas for localStorage (keeping original structure)
export const userPreferencesSchema = z.object({
  theme: z.enum(["light", "dark"]).default("dark"),
  bookmarkedStories: z.array(z.string()).default([]),
  readingList: z.array(z.string()).default([]),
  favoriteGenres: z.array(z.string()).default([]),
  filters: z.object({
    fandom: z.string().optional(),
    status: z.array(z.string()).default([]),
    rating: z.array(z.string()).default([]),
    wordCount: z.string().optional()
  }).default({})
});

export const filterOptionsSchema = z.object({
  fandoms: z.array(z.string()),
  statuses: z.array(z.string()),
  ratings: z.array(z.string()),
  wordCounts: z.array(z.object({
    label: z.string(),
    value: z.string()
  }))
});

export type UserPreferences = z.infer<typeof userPreferencesSchema>;
export type FilterOptions = z.infer<typeof filterOptionsSchema>;
