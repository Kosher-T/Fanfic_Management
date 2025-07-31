import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { filterOptions } from '@/lib/mock-data';

interface SidebarFiltersProps {
  filters: {
    fandom?: string;
    status: string[];
    rating: string[];
    wordCount?: string;
  };
  onFiltersChange: (filters: any) => void;
}

export function SidebarFilters({ filters, onFiltersChange }: SidebarFiltersProps) {
  const handleFandomChange = (value: string) => {
    onFiltersChange({ ...filters, fandom: value });
  };

  const handleStatusChange = (status: string, checked: boolean) => {
    const newStatuses = checked
      ? [...filters.status, status]
      : filters.status.filter(s => s !== status);
    onFiltersChange({ ...filters, status: newStatuses });
  };

  const handleRatingChange = (rating: string, checked: boolean) => {
    const newRatings = checked
      ? [...filters.rating, rating]
      : filters.rating.filter(r => r !== rating);
    onFiltersChange({ ...filters, rating: newRatings });
  };

  const handleWordCountChange = (value: string) => {
    onFiltersChange({ ...filters, wordCount: value });
  };

  return (
    <div className="w-64 flex-shrink-0">
      <Card className="sticky top-32">
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-sm font-medium mb-2 block">Fandom</Label>
          <Select value={filters.fandom || 'All Fandoms'} onValueChange={handleFandomChange}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.fandoms.map(fandom => (
                <SelectItem key={fandom} value={fandom}>
                  {fandom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label className="text-sm font-medium mb-2 block">Status</Label>
          <div className="space-y-2">
            {filterOptions.statuses.map(status => (
              <div key={status} className="flex items-center space-x-2">
                <Checkbox
                  id={`status-${status}`}
                  checked={filters.status.includes(status)}
                  onCheckedChange={(checked) => handleStatusChange(status, checked as boolean)}
                />
                <Label htmlFor={`status-${status}`} className="text-sm">
                  {status}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <Label className="text-sm font-medium mb-2 block">Rating</Label>
          <div className="space-y-2">
            {filterOptions.ratings.map(rating => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox
                  id={`rating-${rating}`}
                  checked={filters.rating.includes(rating)}
                  onCheckedChange={(checked) => handleRatingChange(rating, checked as boolean)}
                />
                <Label htmlFor={`rating-${rating}`} className="text-sm">
                  {rating}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <Label className="text-sm font-medium mb-2 block">Word Count</Label>
          <Select value={filters.wordCount || 'any'} onValueChange={handleWordCountChange}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.wordCounts.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      </Card>
    </div>
  );
}
