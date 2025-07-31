import React from 'react';
import { Star, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Story } from '@shared/schema';

interface TrendingSectionProps {
  stories: Story[];
}

export function TrendingSection({ stories }: TrendingSectionProps) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Trending This Week
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stories.map((story, index) => (
            <div key={story.id} className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg border border-border">
              <div className="flex items-center justify-center w-8 h-8 bg-secondary text-secondary-foreground rounded-full font-bold text-sm">
                #{index + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-semibold text-foreground">{story.title}</h4>
                  <Badge className={`${getFandomColor(story.fandom)} text-white text-xs font-medium`}>
                    {story.fandom}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm line-clamp-2">
                  {story.summary}
                </p>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-2">
                  <span>{story.author}</span>
                  <span>{formatWordCount(story.wordCount)} words</span>
                  <div className="flex items-center text-yellow-400">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="ml-1">{typeof story.rating === 'string' ? story.rating : story.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-green-600 font-semibold">
                  +{story.weeklyViews ? Math.round(story.weeklyViews / 100) / 10 : 0}k views
                </div>
                <div className="text-muted-foreground text-xs">this week</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
