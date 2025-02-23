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
  onSearch: (query: string) => void;
  selectedId?: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  searchQuery: string;
}

export function MaterialMappingList({
  mappings,
  loading,
  onSelect,
  onSearch,
  selectedId,
  currentPage,
  totalPages,
  onPageChange,
  searchQuery,
}: MaterialMappingListProps) {
  const [searchValue, setSearchValue] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== searchQuery) {
        onSearch(searchValue);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue, onSearch, searchQuery]);

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
                onClick={() => onPageChange(currentPage - 1)}
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
                onClick={() => onPageChange(currentPage + 1)}
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