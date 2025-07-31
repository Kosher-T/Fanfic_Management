import React from 'react';
import { Star, User, FileText, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Story } from '@shared/schema';
import { isStoryBookmarked, toggleBookmark } from '@/lib/localStorage';

interface StoryCardProps {
  story: Story;
  onBookmarkChange?: () => void;
}

export function StoryCard({ story, onBookmarkChange }: StoryCardProps) {
  const [isBookmarked, setIsBookmarked] = React.useState(() => isStoryBookmarked(story.id));

  const handleBookmarkToggle = () => {
    const newBookmarkState = toggleBookmark(story.id);
    setIsBookmarked(newBookmarkState);
    onBookmarkChange?.();
  };

  const formatWordCount = (count: number) => {
    if (count >= 1000) {
      return `${Math.round(count / 1000)}k`;
    }
    return count.toString();
  };

  const getFandomColor = (fandom: string) => {
    const colors: { [key: string]: string } = {
      'Harry Potter': 'bg-purple-600',
      'Marvel': 'bg-blue-600',
      'Naruto': 'bg-orange-600',
      'My Hero Academia': 'bg-green-600',
      'Worm': 'bg-red-600'
    };
    return colors[fandom] || 'bg-gray-600';
  };

  const getTagColors = (tag: string) => {
    const colors: { [key: string]: string } = {
      'Adventure': 'bg-blue-900/50 text-blue-200',
      'Angst': 'bg-red-900/50 text-red-200',
      'Action': 'bg-purple-900/50 text-purple-200',
      'Drama': 'bg-green-900/50 text-green-200',
      'Friendship': 'bg-blue-900/50 text-blue-200',
      'School': 'bg-purple-900/50 text-purple-200',
      'Superhero': 'bg-indigo-900/50 text-indigo-200',
      'Alt-Power': 'bg-yellow-900/50 text-yellow-200',
      'Smart Hermione': 'bg-teal-900/50 text-teal-200',
      'Magic Theory': 'bg-indigo-900/50 text-indigo-200'
    };
    return colors[tag] || 'bg-gray-900/50 text-gray-200';
  };

  const formatLastUpdated = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Updated today';
    if (diffInDays === 1) return 'Updated 1 day ago';
    if (diffInDays < 7) return `Updated ${diffInDays} days ago`;
    if (diffInDays < 30) return `Updated ${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `Updated ${Math.floor(diffInDays / 30)} months ago`;
    return `Updated ${Math.floor(diffInDays / 365)} years ago`;
  };

  return (
    <Card className="story-card">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Badge className={`${getFandomColor(story.fandom)} text-white text-xs font-medium`}>
              {story.fandom}
            </Badge>
            <div className="flex items-center text-yellow-400 text-sm">
              <Star className="w-4 h-4 fill-current" />
              <span className="ml-1">{typeof story.rating === 'string' ? story.rating : story.rating.toFixed(1)}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBookmarkToggle}
            className={`h-8 w-8 ${isBookmarked ? 'text-accent' : 'text-muted-foreground hover:text-accent'}`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </Button>
        </div>
        
        <h4 className="text-lg font-semibold text-foreground mb-2 hover:text-primary cursor-pointer transition-colors">
          {story.title}
        </h4>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
          {story.summary}
        </p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <User className="w-3 h-3" />
              <span>{story.author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <FileText className="w-3 h-3" />
              <span>{formatWordCount(story.wordCount)} words</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-wrap gap-1">
            {story.tags.slice(0, 2).map(tag => (
              <Badge key={tag} variant="secondary" className={`text-xs ${getTagColors(tag)}`}>
                {tag}
              </Badge>
            ))}
          </div>
          <Badge 
            variant={story.status === 'complete' ? 'default' : 'secondary'}
            className={`text-xs font-medium ${
              story.status === 'complete' 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-yellow-600/20 text-yellow-600'
            }`}
          >
            {story.status === 'complete' ? 'Complete' : 'In Progress'}
          </Badge>
        </div>
        
        <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>{formatLastUpdated(story.lastUpdated)}</span>
          <Badge variant="outline" className="text-xs">
            {story.source}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
