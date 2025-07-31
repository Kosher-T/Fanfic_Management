import { InsertStory } from "@shared/schema";

export interface ScrapingConfig {
  rateLimitMs: number;
  maxRetries: number;
  userAgent: string;
  respectRobotsTxt: boolean;
}

export interface ScrapedStory {
  title: string;
  author: string;
  summary: string;
  fandom: string;
  tags: string[];
  rating: string;
  wordCount: number;
  status: 'complete' | 'in-progress' | 'on-hiatus';
  lastUpdated: Date;
  source: 'AO3' | 'FFN' | 'SpaceBattles' | 'Sufficient Velocity';
  originalUrl: string;
  viewCount?: number;
  weeklyViews?: number;
}

export abstract class BaseScraper {
  protected config: ScrapingConfig;
  protected lastRequestTime = 0;

  constructor(config: Partial<ScrapingConfig> = {}) {
    this.config = {
      rateLimitMs: 2000, // 2 seconds between requests
      maxRetries: 3,
      userAgent: 'FicRecs Bot 1.0 (Educational Project)',
      respectRobotsTxt: true,
      ...config
    };
  }

  protected async delay(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    const waitTime = Math.max(0, this.config.rateLimitMs - timeSinceLastRequest);
    
    if (waitTime > 0) {
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequestTime = Date.now();
  }

  protected async fetchWithRetry(url: string, options: RequestInit = {}): Promise<Response> {
    let lastError: Error;

    for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
      try {
        await this.delay();
        
        const response = await fetch(url, {
          ...options,
          headers: {
            'User-Agent': this.config.userAgent,
            ...options.headers
          }
        });

        if (response.ok) {
          return response;
        }

        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      } catch (error) {
        lastError = error as Error;
        console.warn(`Attempt ${attempt}/${this.config.maxRetries} failed for ${url}:`, error);
        
        if (attempt < this.config.maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }

    throw new Error(`Failed to fetch ${url} after ${this.config.maxRetries} attempts: ${lastError!.message}`);
  }

  abstract scrapeStory(url: string): Promise<ScrapedStory>;
  abstract searchStories(query: string, limit?: number): Promise<ScrapedStory[]>;
  abstract getPopularStories(fandom?: string, limit?: number): Promise<ScrapedStory[]>;

  protected convertToInsertStory(scraped: ScrapedStory): InsertStory {
    return {
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
  }

  protected cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ')
      .replace(/[\r\n\t]+/g, ' ')
      .trim();
  }

  protected parseWordCount(text: string): number {
    const match = text.match(/[\d,]+/);
    if (match) {
      return parseInt(match[0].replace(/,/g, ''), 10);
    }
    return 0;
  }

  protected parseRating(text: string): string {
    // Extract numerical rating or convert letter grades
    const numMatch = text.match(/(\d+(?:\.\d+)?)/);
    if (numMatch) {
      return parseFloat(numMatch[1]).toFixed(1);
    }
    
    // Convert letter grades to numbers
    const letterRatings: { [key: string]: string } = {
      'K': '3.0',
      'K+': '3.5', 
      'T': '4.0',
      'M': '4.5',
      'E': '4.8'
    };
    
    for (const [letter, rating] of Object.entries(letterRatings)) {
      if (text.includes(letter)) {
        return rating;
      }
    }
    
    return '4.0'; // Default rating
  }
}