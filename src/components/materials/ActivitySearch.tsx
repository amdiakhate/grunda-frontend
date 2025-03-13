import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { materialMappingsService } from '@/services/materialMappings';

interface Activity {
  name: string;
  location: string;
  comment: string;
  referenceProduct: string;
  uuid: string;
  unit: string;
}

interface ActivitySearchProps {
  onSelect: (activity: Activity) => void;
  trigger?: React.ReactNode;
}

export function ActivitySearch({ onSelect, trigger }: ActivitySearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    setActivities([]); // Reset results when search terms change
    const timer = setTimeout(() => {
      handleSearch();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, location]);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const response = await materialMappingsService.searchActivities({
        search: searchTerm.trim(),
        location: location.trim() || 'GLO',
        limit: 20
      });
      
      // Convertir les résultats au format Activity
      const formattedActivities: Activity[] = response.map(result => ({
        name: result.name,
        location: result.location,
        comment: result.comment,
        referenceProduct: result.referenceProduct,
        uuid: result.uuid,
        unit: result.unit
      }));
      
      setActivities(formattedActivities);
    } catch (error) {
      console.error('Failed to search activities:', error);
      setActivities([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (activity: Activity) => {
    onSelect(activity);
    setIsOpen(false);
    setSearchTerm('');
    setLocation('');
    setActivities([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Search Activity</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Search Activities</DialogTitle>
        </DialogHeader>
        
        <div className="flex gap-2 my-4">
          <div className="flex-1">
            <Input
              placeholder="Search by activity name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-32">
            <Input
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <Button onClick={handleSearch} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="flex-1 overflow-auto">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {isLoading ? 'Searching...' : 'No activities found'}
            </div>
          ) : (
            <div className="space-y-2">
              {activities.map((activity) => (
                <div
                  key={activity.uuid}
                  className="p-4 border rounded-lg hover:bg-accent cursor-pointer"
                  onClick={() => handleSelect(activity)}
                >
                  <div className="font-medium">{activity.name}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Reference Product: {activity.referenceProduct}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">{activity.location}</Badge>
                    <Badge variant="outline">{activity.unit}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 