import { Story, FilterOptions } from '@shared/schema';

export const mockStories: Story[] = [
  {
    id: '1',
    title: 'The Darkness Within',
    author: 'DarkMagicWriter',
    summary: 'After the war, Harry struggles with the darkness he absorbed from Voldemort\'s soul. A compelling exploration of trauma, healing, and finding hope in the shadows.',
    fandom: 'Harry Potter',
    tags: ['Dark', 'Post-War', 'Trauma', 'Healing'],
    rating: 4.8,
    wordCount: 142000,
    status: 'complete',
    lastUpdated: '2024-07-20',
    source: 'AO3',
    isFeatured: true,
    viewCount: 15420,
    weeklyViews: 890
  },
  {
    id: '2',
    title: 'Web of Shadows',
    author: 'WebSlinger23',
    summary: 'Peter Parker discovers that his spider powers are connected to an ancient mystical force that spans across dimensions.',
    fandom: 'Marvel',
    tags: ['Adventure', 'Angst', 'Multiverse'],
    rating: 4.7,
    wordCount: 87000,
    status: 'in-progress',
    lastUpdated: '2024-07-27',
    source: 'AO3',
    viewCount: 8950,
    weeklyViews: 650
  },
  {
    id: '3',
    title: 'The Hokage\'s Shadow',
    author: 'ShadowNinja92',
    summary: 'An alternate timeline where Naruto never becomes Hokage, and must work from the shadows to protect the village he loves.',
    fandom: 'Naruto',
    tags: ['Action', 'Drama', 'Alternate Universe'],
    rating: 4.5,
    wordCount: 156000,
    status: 'complete',
    lastUpdated: '2024-07-22',
    source: 'FFN',
    viewCount: 12300,
    weeklyViews: 420
  },
  {
    id: '4',
    title: 'Administrative Results',
    author: 'AdminUser404',
    summary: 'Taylor triggers with a different power and must navigate the complex world of parahuman politics and bureaucracy.',
    fandom: 'Worm',
    tags: ['Superhero', 'Alt-Power', 'Politics'],
    rating: 4.9,
    wordCount: 234000,
    status: 'in-progress',
    lastUpdated: '2024-07-29',
    source: 'SpaceBattles',
    viewCount: 18750,
    weeklyViews: 2300
  },
  {
    id: '5',
    title: 'Quirkless Hero',
    author: 'HeroAcademic',
    summary: 'Izuku never receives One For All but finds another path to heroism through determination and strategic thinking.',
    fandom: 'My Hero Academia',
    tags: ['Friendship', 'School', 'Quirkless Izuku'],
    rating: 4.6,
    wordCount: 98000,
    status: 'in-progress',
    lastUpdated: '2024-07-28',
    source: 'AO3',
    viewCount: 9800,
    weeklyViews: 1200
  },
  {
    id: '6',
    title: 'The Arithmancer',
    author: 'MathMagic101',
    summary: 'Hermione discovers the true power of magical mathematics and reshapes the wizarding world through logic and calculation.',
    fandom: 'Harry Potter',
    tags: ['Smart Hermione', 'Magic Theory', 'Mathematics'],
    rating: 3.4,
    wordCount: 312000,
    status: 'complete',
    lastUpdated: '2024-04-15',
    source: 'FFN',
    viewCount: 45600,
    weeklyViews: 180
  },
  {
    id: '7',
    title: 'The Iron Phoenix',
    author: 'CyberStark',
    summary: 'After Endgame, Tony Stark finds himself in an alternate universe where he must rebuild everything from scratch.',
    fandom: 'Marvel',
    tags: ['AI', 'Technology', 'Rebirth'],
    rating: 4.8,
    wordCount: 189000,
    status: 'in-progress',
    lastUpdated: '2024-07-26',
    source: 'Sufficient Velocity',
    viewCount: 11200,
    weeklyViews: 780
  },
  {
    id: '8',
    title: 'Breaking Point',
    author: 'TriggerHappy',
    summary: 'Taylor\'s trigger event goes differently, leading to a completely new power dynamic in Brockton Bay.',
    fandom: 'Worm',
    tags: ['Trigger Event', 'Alternate Power', 'Brockton Bay'],
    rating: 4.9,
    wordCount: 125000,
    status: 'in-progress',
    lastUpdated: '2024-07-29',
    source: 'SpaceBattles',
    viewCount: 22100,
    weeklyViews: 2300
  },
  {
    id: '9',
    title: 'The Snake\'s Gambit',
    author: 'SlytherinLight',
    summary: 'A different take on Harry\'s sorting, where he ends up in Slytherin and changes the house from within.',
    fandom: 'Harry Potter',
    tags: ['Slytherin Harry', 'House Unity', 'Political'],
    rating: 4.7,
    wordCount: 78000,
    status: 'in-progress',
    lastUpdated: '2024-07-28',
    source: 'AO3',
    viewCount: 16800,
    weeklyViews: 1900
  },
  {
    id: '10',
    title: 'Plus Ultra Academy',
    author: 'QuirkMaster',
    summary: 'An OC enters UA Academy with a unique quirk that changes the dynamics of Class 1-A forever.',
    fandom: 'My Hero Academia',
    tags: ['OC', 'UA Academy', 'Class 1-A'],
    rating: 4.3,
    wordCount: 92000,
    status: 'in-progress',
    lastUpdated: '2024-07-28',
    source: 'AO3',
    viewCount: 8900,
    weeklyViews: 1700
  }
];

export const filterOptions: FilterOptions = {
  fandoms: ['All Fandoms', 'Harry Potter', 'Marvel', 'Naruto', 'My Hero Academia', 'Worm'],
  statuses: ['Complete', 'In Progress', 'On Hiatus'],
  ratings: ['4+ Stars', '3+ Stars'],
  wordCounts: [
    { label: 'Any Length', value: 'any' },
    { label: 'Short (< 10k)', value: 'short' },
    { label: 'Medium (10k-50k)', value: 'medium' },
    { label: 'Long (50k-100k)', value: 'long' },
    { label: 'Epic (100k+)', value: 'epic' }
  ]
};

export function getFeaturedStory(): Story | undefined {
  return mockStories.find(story => story.isFeatured);
}

export function getTrendingStories(): Story[] {
  return mockStories
    .filter(story => story.weeklyViews && story.weeklyViews > 0)
    .sort((a, b) => (b.weeklyViews || 0) - (a.weeklyViews || 0))
    .slice(0, 3);
}

export function getFilteredStories(filters: {
  fandom?: string;
  status?: string[];
  rating?: string[];
  wordCount?: string;
  search?: string;
}): Story[] {
  let filtered = mockStories.filter(story => !story.isFeatured);

  if (filters.fandom && filters.fandom !== 'All Fandoms') {
    filtered = filtered.filter(story => story.fandom === filters.fandom);
  }

  if (filters.status && filters.status.length > 0) {
    filtered = filtered.filter(story => {
      const statusMap: { [key: string]: string } = {
        'Complete': 'complete',
        'In Progress': 'in-progress',
        'On Hiatus': 'on-hiatus'
      };
      return filters.status!.some(status => statusMap[status] === story.status);
    });
  }

  if (filters.rating && filters.rating.length > 0) {
    filtered = filtered.filter(story => {
      if (filters.rating!.includes('4+ Stars') && story.rating >= 4) return true;
      if (filters.rating!.includes('3+ Stars') && story.rating >= 3) return true;
      return false;
    });
  }

  if (filters.wordCount && filters.wordCount !== 'any') {
    filtered = filtered.filter(story => {
      switch (filters.wordCount) {
        case 'short': return story.wordCount < 10000;
        case 'medium': return story.wordCount >= 10000 && story.wordCount < 50000;
        case 'long': return story.wordCount >= 50000 && story.wordCount < 100000;
        case 'epic': return story.wordCount >= 100000;
        default: return true;
      }
    });
  }

  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filtered = filtered.filter(story =>
      story.title.toLowerCase().includes(searchTerm) ||
      story.author.toLowerCase().includes(searchTerm) ||
      story.summary.toLowerCase().includes(searchTerm) ||
      story.fandom.toLowerCase().includes(searchTerm) ||
      story.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  return filtered;
}
