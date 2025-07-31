import { BaseScraper, ScrapedStory } from './base-scraper';
import * as cheerio from 'cheerio';

export class AO3Scraper extends BaseScraper {
  private baseUrl = 'https://archiveofourown.org';

  constructor() {
    super({
      rateLimitMs: 1000, // AO3 is more lenient
      userAgent: 'FicRecs Educational Bot 1.0 - Contact: ficrecs@example.com'
    });
  }

  async scrapeStory(url: string): Promise<ScrapedStory> {
    const response = await this.fetchWithRetry(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const title = this.cleanText($('#workskin .title').first().text());
    const author = this.cleanText($('.byline a[rel="author"]').first().text());
    const summary = this.cleanText($('.summary blockquote').text());
    
    // Extract metadata from the stats list
    const wordCountText = $('.stats .words').text();
    const wordCount = this.parseWordCount(wordCountText);
    
    const fandom = this.cleanText($('.fandom a').first().text());
    const tags = $('.freeform a').map((_, el) => $(el).text().trim()).get();
    
    const rating = this.cleanText($('.rating a').text());
    const mappedRating = this.mapAO3Rating(rating);
    
    const statusText = $('.stats .chapters').text();
    const status = this.parseStatus(statusText);
    
    const lastUpdatedText = $('.stats .published').text();
    const lastUpdated = this.parseDate(lastUpdatedText);
    
    const viewCountText = $('.stats .hits').text();
    const viewCount = this.parseWordCount(viewCountText);

    return {
      title,
      author,
      summary,
      fandom,
      tags,
      rating: mappedRating,
      wordCount,
      status,
      lastUpdated,
      source: 'AO3',
      originalUrl: url,
      viewCount,
      weeklyViews: Math.round(viewCount * 0.1) // Estimate weekly views
    };
  }

  async searchStories(query: string, limit = 20): Promise<ScrapedStory[]> {
    const searchUrl = `${this.baseUrl}/works/search?work_search[query]=${encodeURIComponent(query)}&work_search[sort_column]=hits&work_search[sort_direction]=desc`;
    
    const response = await this.fetchWithRetry(searchUrl);
    const html = await response.text();
    const $ = cheerio.load(html);

    const stories: ScrapedStory[] = [];
    const workItems = $('.work.blurb').slice(0, limit);

    for (let i = 0; i < workItems.length; i++) {
      const element = workItems[i];
      const $work = $(element);
      
      try {
        const storyUrl = this.baseUrl + $work.find('.heading a').attr('href');
        const story = await this.scrapeStory(storyUrl);
        stories.push(story);
      } catch (error) {
        console.warn(`Failed to scrape story ${i + 1}:`, error);
      }
    }

    return stories;
  }

  async getPopularStories(fandom?: string, limit = 20): Promise<ScrapedStory[]> {
    let searchUrl = `${this.baseUrl}/works?work_search[sort_column]=hits&work_search[sort_direction]=desc`;
    
    if (fandom) {
      searchUrl += `&work_search[fandom_names]=${encodeURIComponent(fandom)}`;
    }

    const response = await this.fetchWithRetry(searchUrl);
    const html = await response.text();
    const $ = cheerio.load(html);

    const stories: ScrapedStory[] = [];
    const workItems = $('.work.blurb').slice(0, limit);

    for (let i = 0; i < workItems.length; i++) {
      const element = workItems[i];
      const $work = $(element);
      
      try {
        const storyUrl = this.baseUrl + $work.find('.heading a').attr('href');
        const story = await this.scrapeStory(storyUrl);
        stories.push(story);
      } catch (error) {
        console.warn(`Failed to scrape popular story ${i + 1}:`, error);
      }
    }

    return stories;
  }

  private mapAO3Rating(rating: string): string {
    const ratingMap: { [key: string]: string } = {
      'General Audiences': '3.5',
      'Teen And Up Audiences': '4.0',
      'Mature': '4.5',
      'Explicit': '4.8',
      'Not Rated': '4.0'
    };
    
    return ratingMap[rating] || '4.0';
  }

  private parseStatus(chaptersText: string): 'complete' | 'in-progress' | 'on-hiatus' {
    if (chaptersText.includes('/')) {
      const [current, total] = chaptersText.split('/');
      if (current.trim() === total.trim() && total.trim() !== '?') {
        return 'complete';
      }
    }
    return 'in-progress';
  }

  private parseDate(dateText: string): Date {
    // AO3 uses format like "2024-01-15"
    const match = dateText.match(/(\d{4}-\d{2}-\d{2})/);
    if (match) {
      return new Date(match[1]);
    }
    return new Date();
  }
}