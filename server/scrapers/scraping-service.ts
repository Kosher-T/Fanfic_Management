import { db } from '../db';
import { stories, InsertStory } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { AO3Scraper } from './ao3-scraper';
import { BaseScraper, ScrapedStory } from './base-scraper';

export class ScrapingService {
  private scrapers: Map<string, BaseScraper>;

  constructor() {
    this.scrapers = new Map([
      ['AO3', new AO3Scraper()],
      // Future scrapers will be added here
      // ['FFN', new FFNScraper()],
      // ['SpaceBattles', new SpaceBattlesScraper()],
      // ['SufficientVelocity', new SufficientVelocityScraper()]
    ]);
  }

  async scrapeAndStoreStories(fandoms: string[] = [], limit = 50): Promise<void> {
    console.log(`Starting scraping operation for ${fandoms.length || 'all'} fandoms with limit ${limit}`);
    
    const allStories: ScrapedStory[] = [];

    for (const [source, scraper] of this.scrapers) {
      console.log(`Scraping from ${source}...`);
      
      try {
        if (fandoms.length > 0) {
          // Scrape specific fandoms
          for (const fandom of fandoms) {
            const stories = await scraper.getPopularStories(fandom, Math.ceil(limit / fandoms.length));
            allStories.push(...stories);
          }
        } else {
          // Scrape popular stories across all fandoms
          const stories = await scraper.getPopularStories(undefined, limit);
          allStories.push(...stories);
        }
      } catch (error) {
        console.error(`Failed to scrape from ${source}:`, error);
      }
    }

    console.log(`Scraped ${allStories.length} stories, storing in database...`);
    await this.storeStories(allStories);
    console.log('Scraping operation completed');
  }

  async searchAndStoreStories(query: string, limit = 20): Promise<void> {
    console.log(`Searching for stories matching "${query}" with limit ${limit}`);
    
    const allStories: ScrapedStory[] = [];

    for (const [source, scraper] of this.scrapers) {
      console.log(`Searching ${source}...`);
      
      try {
        const stories = await scraper.searchStories(query, Math.ceil(limit / this.scrapers.size));
        allStories.push(...stories);
      } catch (error) {
        console.error(`Failed to search ${source}:`, error);
      }
    }

    console.log(`Found ${allStories.length} stories, storing in database...`);
    await this.storeStories(allStories);
    console.log('Search operation completed');
  }

  private async storeStories(scrapedStories: ScrapedStory[]): Promise<void> {
    const insertData: InsertStory[] = [];

    for (const scraped of scrapedStories) {
      // Check if story already exists by title and author
      const existingStory = await db.query.stories.findFirst({
        where: (stories, { and, eq }) => and(
          eq(stories.title, scraped.title),
          eq(stories.author, scraped.author)
        )
      });

      if (!existingStory) {
        const insertStory: InsertStory = {
          title: scraped.title,
          author: scraped.author,
          summary: scraped.summary,
          fandom: scraped.fandom,
          tags: scraped.tags,
          rating: scraped.rating,
          wordCount: scraped.wordCount,
          status: scraped.status,
          lastUpdated: scraped.lastUpdated,
          source: scraped.source,
          viewCount: scraped.viewCount || 0,
          weeklyViews: scraped.weeklyViews || 0,
          isFeatured: false
        };

        insertData.push(insertStory);
      } else {
        console.log(`Story "${scraped.title}" by ${scraped.author} already exists, skipping...`);
      }
    }

    if (insertData.length > 0) {
      await db.insert(stories).values(insertData);
      console.log(`Stored ${insertData.length} new stories in database`);
    } else {
      console.log('No new stories to store');
    }
  }

  async updateWeeklyViews(): Promise<void> {
    console.log('Updating weekly view counts...');
    
    // Get all stories from database
    const allStories = await db.query.stories.findMany();
    
    for (const story of allStories) {
      if (story.source && this.scrapers.has(story.source)) {
        try {
          // For now, we'll estimate weekly views as 10% of total views
          // In a real implementation, you'd track this over time
          const weeklyViews = Math.round(story.viewCount * 0.1);
          
          await db.update(stories)
            .set({ weeklyViews })
            .where(eq(stories.id, story.id));
            
        } catch (error) {
          console.error(`Failed to update weekly views for story ${story.id}:`, error);
        }
      }
    }
    
    console.log('Weekly view update completed');
  }

  getAvailableSources(): string[] {
    return Array.from(this.scrapers.keys());
  }
}

export const scrapingService = new ScrapingService();