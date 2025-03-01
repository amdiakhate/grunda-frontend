import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MaterialMapping } from '@/interfaces/materialMapping';
import { Loader2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MaterialMappingListProps {
  mappings: MaterialMapping[];
  loading: boolean;
  onSelect: (mapping: MaterialMapping) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedId?: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  processingId?: string | null;
}

export function MaterialMappingList({
  mappings,
  loading,
  onSelect,
  searchQuery,
  onSearchChange,
  selectedId,
  currentPage,
  totalPages,
  onPageChange,
  processingId,
}: MaterialMappingListProps) {
  const [searchValue, setSearchValue] = useState(searchQuery);

  // Sync local search value with parent searchQuery
  useEffect(() => {
    setSearchValue(searchQuery);
  }, [searchQuery]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== searchQuery) {
        onSearchChange(searchValue);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue, onSearchChange, searchQuery]);

  const handlePageChange = (page: number) => {
    // Prevent default scroll behavior
    const currentScroll = window.scrollY;
    onPageChange(page);
    // Restore scroll position after a short delay to ensure the new content is rendered
    setTimeout(() => window.scrollTo(0, currentScroll), 0);
  };

  if (processingId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          {processingId === '' 
            ? 'Removing current activity mapping...'
            : 'Updating activity mapping...'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search mappings..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-9"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : mappings.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No mappings found
          {searchQuery && (
            <p className="text-sm mt-1">
              Try adjusting your search criteria
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-2">
            {mappings.map((mapping) => (
              <button
                key={mapping.id}
                onClick={() => onSelect(mapping)}
                className={cn(
                  'p-4 text-left rounded-lg border hover:bg-muted/50 transition-colors',
                  selectedId === mapping.id && 'border-primary bg-primary/5'
                )}
              >
                <div className="font-medium">{mapping.materialPattern}</div>
                {mapping.activityName && (
                  <div className="text-sm text-muted-foreground mt-1">
                    Activity: {mapping.activityName}
                  </div>
                )}
                {mapping.referenceProduct && (
                  <div className="text-sm text-muted-foreground mt-1">
                    Reference Product: {mapping.referenceProduct}
                  </div>
                )}
                {!mapping.finalProduct && mapping.transformationActivityName && (
                  <div className="text-sm text-muted-foreground mt-1">
                    Transformation Activity: {mapping.transformationActivityName}
                  </div>
                )}
                {/* <div className="text-sm text-muted-foreground mt-1">
                  Origin: {mapping.activityOrigin || 'Not specified'}
                </div> */}
                {/* <div className="text-sm text-muted-foreground">
                  Unit: {mapping.activityUnit || 'Not specified'}
                </div> */}
              </button>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 