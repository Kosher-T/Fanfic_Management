import React from 'react';
import { Star, User, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Story } from '@shared/schema';

interface FeaturedStoryProps {
  story: Story;
}

export function FeaturedStory({ story }: FeaturedStoryProps) {
  const formatWordCount = (count: number) => {
    if (count >= 1000) {
      return `${Math.round(count / 1000)}k`;
    }
    return count.toString();
  };

  const renderStars = (rating: string | number) => {
    const numRating = typeof rating === 'string' ? parseFloat(rating) : rating;
    const stars = [];
    const fullStars = Math.floor(numRating);
    const hasHalfStar = numRating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-3 h-3 fill-yellow-400/50 text-yellow-400" />);
    }
    
    return stars;
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
    <div className="featured-gradient rounded-xl p-6 mb-8 relative overflow-hidden">
      <div className="absolute top-4 left-4">
        <Badge className="bg-secondary text-secondary-foreground font-semibold">
          FEATURED
        </Badge>
      </div>
      
      <div className="flex items-start justify-between mt-8">
        <div className="flex-1 pr-6">
          <div className="flex items-center space-x-2 mb-2">
            <Badge className={`${getFandomColor(story.fandom)} text-white text-xs font-medium`}>
              {story.fandom}
            </Badge>
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-3">
            {story.title}
          </h3>
          <p className="text-purple-100 mb-4 leading-relaxed">
            {story.summary}
          </p>
          
          <div className="flex items-center space-x-4 text-purple-200">
            <div className="flex items-center space-x-1">
              <User className="w-3 h-3" />
              <span className="text-sm">{story.author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <FileText className="w-3 h-3" />
              <span className="text-sm">{formatWordCount(story.wordCount)} words</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="flex">
                {renderStars(story.rating)}
              </div>
              <span className="text-sm">{typeof story.rating === 'string' ? story.rating : story.rating.toFixed(1)}/5</span>
            </div>
            <Badge 
              className={`text-xs font-medium ${
                story.status === 'complete' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-yellow-600 text-white'
              }`}
            >
              {story.status === 'complete' ? 'Complete' : 'In Progress'}
            </Badge>
          </div>
        </div>
        
        <div className="flex-shrink-0">
          <img 
            src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300" 
            alt="Featured story illustration" 
            className="w-32 h-24 rounded-lg object-cover shadow-lg" 
          />
        </div>
      </div>
    </div>
  );
}
