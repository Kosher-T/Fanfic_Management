import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Download, Search, RefreshCw, Database } from 'lucide-react';

export default function AdminPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [fandoms, setFandoms] = useState('');
  const [limit, setLimit] = useState(20);
  const { toast } = useToast();

  // Get available scraping sources
  const { data: sourcesData } = useQuery({
    queryKey: ['/api/scrape/sources'],
  });

  // Scrape popular stories mutation
  const scrapePopularMutation = useMutation({
    mutationFn: async (data: { fandoms?: string[], limit: number }) => {
      return apiRequest('/api/scrape/popular', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Scraping Completed",
        description: data.message,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Scraping Failed",
        description: error.message || "Failed to scrape stories",
        variant: "destructive",
      });
    }
  });

  // Search and scrape mutation
  const scrapeSearchMutation = useMutation({
    mutationFn: async (data: { query: string, limit: number }) => {
      return apiRequest('/api/scrape/search', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Search Scraping Completed",
        description: data.message,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Search Scraping Failed",
        description: error.message || "Failed to scrape search results",
        variant: "destructive",
      });
    }
  });

  // Update weekly views mutation
  const updateViewsMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('/api/scrape/update-views', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Views Updated",
        description: data.message,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update weekly views",
        variant: "destructive",
      });
    }
  });

  const handleScrapePopular = () => {
    const fandomList = fandoms.trim() ? fandoms.split(',').map(f => f.trim()) : undefined;
    scrapePopularMutation.mutate({ fandoms: fandomList, limit });
  };

  const handleScrapeSearch = () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search Required",
        description: "Please enter a search query",
        variant: "destructive",
      });
      return;
    }
    scrapeSearchMutation.mutate({ query: searchQuery.trim(), limit });
  };

  const handleUpdateViews = () => {
    updateViewsMutation.mutate();
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">FicRecs Admin</h1>
        <p className="text-muted-foreground">Manage scraping operations and database content</p>
      </div>

      {/* Available Sources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="w-5 h-5" />
            <span>Available Sources</span>
          </CardTitle>
          <CardDescription>
            Currently supported fanfiction platforms for scraping
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {sourcesData?.sources?.map((source: string) => (
              <Badge key={source} variant="secondary">
                {source}
              </Badge>
            )) || <Badge variant="outline">Loading...</Badge>}
          </div>
        </CardContent>
      </Card>

      {/* Scrape Popular Stories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="w-5 h-5" />
            <span>Scrape Popular Stories</span>
          </CardTitle>
          <CardDescription>
            Fetch and store popular stories from supported platforms
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fandoms">Fandoms (optional)</Label>
            <Textarea
              id="fandoms"
              placeholder="Harry Potter, Naruto, Marvel (comma-separated, leave empty for all fandoms)"
              value={fandoms}
              onChange={(e) => setFandoms(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="limit">Story Limit</Label>
            <Input
              id="limit"
              type="number"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              min="1"
              max="100"
            />
          </div>
          <Button 
            onClick={handleScrapePopular}
            disabled={scrapePopularMutation.isPending}
            className="w-full"
          >
            {scrapePopularMutation.isPending ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Scraping...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Scrape Popular Stories
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Search and Scrape */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Search and Scrape</span>
          </CardTitle>
          <CardDescription>
            Search for specific stories and add them to the database
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="searchQuery">Search Query</Label>
            <Input
              id="searchQuery"
              placeholder="Enter search terms (e.g., 'time travel', 'RWBY crossover')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="searchLimit">Result Limit</Label>
            <Input
              id="searchLimit"
              type="number"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              min="1"
              max="50"
            />
          </div>
          <Button 
            onClick={handleScrapeSearch}
            disabled={scrapeSearchMutation.isPending}
            className="w-full"
          >
            {scrapeSearchMutation.isPending ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Search and Scrape
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Update Weekly Views */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <RefreshCw className="w-5 h-5" />
            <span>Update Weekly Views</span>
          </CardTitle>
          <CardDescription>
            Refresh weekly view counts for trending calculations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleUpdateViews}
            disabled={updateViewsMutation.isPending}
            className="w-full"
            variant="outline"
          >
            {updateViewsMutation.isPending ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Update Weekly Views
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Warning Notice */}
      <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
        <CardHeader>
          <CardTitle className="text-yellow-800 dark:text-yellow-200">Important Notice</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            Scraping operations respect each platform's terms of service and implement proper rate limiting. 
            Large scraping operations may take several minutes to complete. Always verify you have permission 
            to scrape content from the target platforms.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}