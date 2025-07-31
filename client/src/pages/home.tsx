import React, { useState, useEffect } from 'react';
import { Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Header } from '@/components/header';
import { SidebarFilters } from '@/components/sidebar-filters';
import { FeaturedStory } from '@/components/featured-story';
import { StoryCard } from '@/components/story-card';
import { TrendingSection } from '@/components/trending-section';
import { Footer } from '@/components/footer';
import { getUserPreferences, saveUserPreferences } from '@/lib/localStorage';
import { Story } from '@shared/schema';
import { useQuery } from '@tanstack/react-query';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    fandom: undefined as string | undefined,
    status: [] as string[],
    rating: [] as string[],
    wordCount: undefined as string | undefined,
  });
  const [bookmarkUpdate, setBookmarkUpdate] = useState(0);

  // Fetch featured story
  const { data: featuredStory } = useQuery<Story>({
    queryKey: ['/api/stories/featured'],
  });

  // Fetch trending stories
  const { data: trendingStories = [] } = useQuery<Story[]>({
    queryKey: ['/api/stories/trending'],
  });

  // Fetch filtered stories
  const { data: stories = [], isLoading } = useQuery<Story[]>({
    queryKey: ['/api/stories', filters, searchQuery, sortBy, bookmarkUpdate],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (filters.fandom && filters.fandom !== 'All Fandoms') {
        params.append('fandom', filters.fandom);
      }
      if (filters.status.length > 0) {
        filters.status.forEach(status => params.append('status', status));
      }
      if (filters.rating.length > 0) {
        filters.rating.forEach(rating => params.append('rating', rating));
      }
      if (filters.wordCount && filters.wordCount !== 'any') {
        params.append('wordCount', filters.wordCount);
      }
      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const response = await fetch(`/api/stories?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch stories');
      }
      const data = await response.json();

      // Sort stories on client side
      let sorted = [...data];
      switch (sortBy) {
        case 'rating':
          sorted.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
          break;
        case 'recent':
          sorted.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
          break;
        case 'wordCount':
          sorted.sort((a, b) => b.wordCount - a.wordCount);
          break;
        default: // popularity
          sorted.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
      }

      return sorted;
    },
  });

  useEffect(() => {
    // Load user preferences
    const prefs = getUserPreferences();
    if (prefs.filters) {
      setFilters({
        fandom: prefs.filters.fandom,
        status: prefs.filters.status || [],
        rating: prefs.filters.rating || [],
        wordCount: prefs.filters.wordCount,
      });
    }
  }, []);

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    
    // Save to user preferences
    const prefs = getUserPreferences();
    prefs.filters = newFilters;
    saveUserPreferences(prefs);
  };

  const handleBookmarkChange = () => {
    setBookmarkUpdate(prev => prev + 1);
  };

  const handleLoadMore = () => {
    // In a real app, this would load more stories from the API
    console.log('Load more stories');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={setSearchQuery} searchQuery={searchQuery} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <SidebarFilters filters={filters} onFiltersChange={handleFiltersChange} />
          
          <main className="flex-1">
            {/* Controls Header - Sticky */}
            <div className="sticky top-16 bg-background/95 backdrop-blur-sm border-b border-border z-40 -mx-4 px-4 py-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Recommended Stories</h2>
                  <p className="text-muted-foreground mt-1">
                    {stories.length} stories found
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popularity">Sort by Popularity</SelectItem>
                      <SelectItem value="rating">Sort by Rating</SelectItem>
                      <SelectItem value="recent">Sort by Recent</SelectItem>
                      <SelectItem value="wordCount">Sort by Word Count</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="flex bg-card rounded-lg border border-border p-1">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Story */}
            {featuredStory && !searchQuery && (
              <FeaturedStory story={featuredStory} />
            )}

            {/* Story Grid */}
            {stories.length > 0 ? (
              <div className={`grid gap-6 mb-8 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {stories.map(story => (
                  <StoryCard 
                    key={story.id} 
                    story={story} 
                    onBookmarkChange={handleBookmarkChange}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No stories found matching your criteria.</p>
                <p className="text-muted-foreground text-sm mt-2">Try adjusting your filters or search terms.</p>
              </div>
            )}

            {/* Trending Section */}
            {!searchQuery && trendingStories.length > 0 && (
              <div className="mb-8">
                <TrendingSection stories={trendingStories} />
              </div>
            )}

            {/* Load More Button */}
            {stories.length > 0 && (
              <div className="text-center">
                <Button 
                  onClick={handleLoadMore}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3"
                >
                  Load More Stories
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
