import { db } from "./db";
import { stories } from "@shared/schema";
import { InsertStory } from "@shared/schema";

const mockStories: InsertStory[] = [
  {
    title: 'The Darkness Within',
    author: 'DarkMagicWriter',
    summary: 'After the war, Harry struggles with the darkness he absorbed from Voldemort\'s soul. A compelling exploration of trauma, healing, and finding hope in the shadows.',
    fandom: 'Harry Potter',
    tags: ['Dark', 'Post-War', 'Trauma', 'Healing'],
    rating: '4.8',
    wordCount: 142000,
    status: 'complete',
    lastUpdated: new Date('2024-07-20'),
    source: 'AO3',
    isFeatured: true,
    viewCount: 15420,
    weeklyViews: 890
  },
  {
    title: 'Web of Shadows',
    author: 'WebSlinger23',
    summary: 'Peter Parker discovers that his spider powers are connected to an ancient mystical force that spans across dimensions.',
    fandom: 'Marvel',
    tags: ['Adventure', 'Angst', 'Multiverse'],
    rating: '4.7',
    wordCount: 87000,
    status: 'in-progress',
    lastUpdated: new Date('2024-07-27'),
    source: 'AO3',
    viewCount: 8950,
    weeklyViews: 650
  },
  {
    title: 'The Hokage\'s Shadow',
    author: 'ShadowNinja92',
    summary: 'An alternate timeline where Naruto never becomes Hokage, and must work from the shadows to protect the village he loves.',
    fandom: 'Naruto',
    tags: ['Action', 'Drama', 'Alternate Universe'],
    rating: '4.5',
    wordCount: 156000,
    status: 'complete',
    lastUpdated: new Date('2024-07-22'),
    source: 'FFN',
    viewCount: 12300,
    weeklyViews: 420
  },
  {
    title: 'Administrative Results',
    author: 'AdminUser404',
    summary: 'Taylor triggers with a different power and must navigate the complex world of parahuman politics and bureaucracy.',
    fandom: 'Worm',
    tags: ['Superhero', 'Alt-Power', 'Politics'],
    rating: '4.9',
    wordCount: 234000,
    status: 'in-progress',
    lastUpdated: new Date('2024-07-29'),
    source: 'SpaceBattles',
    viewCount: 18750,
    weeklyViews: 2300
  },
  {
    title: 'Quirkless Hero',
    author: 'HeroAcademic',
    summary: 'Izuku never receives One For All but finds another path to heroism through determination and strategic thinking.',
    fandom: 'My Hero Academia',
    tags: ['Friendship', 'School', 'Quirkless Izuku'],
    rating: '4.6',
    wordCount: 98000,
    status: 'in-progress',
    lastUpdated: new Date('2024-07-28'),
    source: 'AO3',
    viewCount: 9800,
    weeklyViews: 1200
  },
  {
    title: 'The Arithmancer',
    author: 'MathMagic101',
    summary: 'Hermione discovers the true power of magical mathematics and reshapes the wizarding world through logic and calculation.',
    fandom: 'Harry Potter',
    tags: ['Smart Hermione', 'Magic Theory', 'Mathematics'],
    rating: '3.4',
    wordCount: 312000,
    status: 'complete',
    lastUpdated: new Date('2024-04-15'),
    source: 'FFN',
    viewCount: 45600,
    weeklyViews: 180
  },
  {
    title: 'The Iron Phoenix',
    author: 'CyberStark',
    summary: 'After Endgame, Tony Stark finds himself in an alternate universe where he must rebuild everything from scratch.',
    fandom: 'Marvel',
    tags: ['AI', 'Technology', 'Rebirth'],
    rating: '4.8',
    wordCount: 189000,
    status: 'in-progress',
    lastUpdated: new Date('2024-07-26'),
    source: 'Sufficient Velocity',
    viewCount: 11200,
    weeklyViews: 780
  },
  {
    title: 'Breaking Point',
    author: 'TriggerHappy',
    summary: 'Taylor\'s trigger event goes differently, leading to a completely new power dynamic in Brockton Bay.',
    fandom: 'Worm',
    tags: ['Trigger Event', 'Alternate Power', 'Brockton Bay'],
    rating: '4.9',
    wordCount: 125000,
    status: 'in-progress',
    lastUpdated: new Date('2024-07-29'),
    source: 'SpaceBattles',
    viewCount: 22100,
    weeklyViews: 2300
  },
  {
    title: 'The Snake\'s Gambit',
    author: 'SlytherinLight',
    summary: 'A different take on Harry\'s sorting, where he ends up in Slytherin and changes the house from within.',
    fandom: 'Harry Potter',
    tags: ['Slytherin Harry', 'House Unity', 'Political'],
    rating: '4.7',
    wordCount: 78000,
    status: 'in-progress',
    lastUpdated: new Date('2024-07-28'),
    source: 'AO3',
    viewCount: 16800,
    weeklyViews: 1900
  },
  {
    title: 'Plus Ultra Academy',
    author: 'QuirkMaster',
    summary: 'An OC enters UA Academy with a unique quirk that changes the dynamics of Class 1-A forever.',
    fandom: 'My Hero Academia',
    tags: ['OC', 'UA Academy', 'Class 1-A'],
    rating: '4.3',
    wordCount: 92000,
    status: 'in-progress',
    lastUpdated: new Date('2024-07-28'),
    source: 'AO3',
    viewCount: 8900,
    weeklyViews: 1700
  }
];

export async function seedDatabase() {
  console.log('Starting database seeding...');
  
  try {
    // Clear existing stories
    await db.delete(stories);
    console.log('Cleared existing stories');
    
    // Insert new stories
    const insertedStories = await db.insert(stories).values(mockStories).returning();
    console.log(`Seeded ${insertedStories.length} stories to database`);
    
    return insertedStories;
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
seedDatabase()
  .then(() => {
    console.log('Database seeding completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Database seeding failed:', error);
    process.exit(1);
  });