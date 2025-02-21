import { useState, Fragment } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MaterialMapping } from '@/interfaces/materialMapping';
import { Search, ChevronLeft, ChevronRight, Check, Loader2, Link2, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MaterialMappingListProps {
  mappings: MaterialMapping[];
  loading: boolean;
  onSelect: (mapping: MaterialMapping) => void;
  onSearch?: (query: string) => void;
  selectedId?: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  processingId?: string;
  currentMapping?: MaterialMapping | null;
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
  processingId,
  currentMapping,
}: MaterialMappingListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    onSearch?.('');
  };

  const handleSelectMapping = (mapping: MaterialMapping, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!processingId) {
      onSelect(mapping);
    }
  };

  if (loading && mappings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4 text-gray-500">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p>Loading mappings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {currentMapping && (
        <div className="flex items-start gap-4 p-4 border rounded-lg bg-muted/30">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Link2 className="h-4 w-4 text-primary" />
              <h3 className="font-medium">Current Activity</h3>
            </div>
            <div className="mt-2 space-y-1">
              <p className="font-medium">{currentMapping.activityName}</p>
              <p className="text-sm text-muted-foreground">{currentMapping.materialPattern}</p>
              {currentMapping.transform && (
                <p className="text-sm text-muted-foreground">Transform: {currentMapping.transform}</p>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="shrink-0"
            onClick={() => onSelect(currentMapping)}
          >
            <X className="h-4 w-4 mr-2" />
            Remove Activity
          </Button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <div className="flex-1">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search materials by pattern, activity name or alternate names..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </form>
        </div>
        {searchQuery && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleClearSearch}
          >
            Clear
          </Button>
        )}
      </div>

      {!mappings?.length ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4 text-gray-500 border rounded-md">
          <AlertCircle className="h-8 w-8" />
          <div className="text-center">
            <p className="font-medium">No matching materials found</p>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your search terms</p>
          </div>
          {searchQuery && (
            <Button variant="outline" size="sm" onClick={handleClearSearch}>
              Clear search
            </Button>
          )}
        </div>
      ) : (
        <div className="border rounded-md relative">
          {loading && (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Material Name</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead className="text-center">Products Using This Material</TableHead>
                <TableHead className="text-center">Comment</TableHead>
                <TableHead className="text-center">Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mappings.map((mapping) => {
                const isSelected = selectedId === mapping.id;
                const isProcessing = processingId === mapping.id;

                return (
                  <TableRow 
                    key={mapping.id} 
                    className={cn(
                      "transition-colors cursor-pointer",
                      isSelected ? "bg-primary/10" : "hover:bg-muted/50"
                    )}
                    onClick={() => handleSelectMapping(mapping)}
                  >
                    <TableCell className="font-medium">
                      {mapping.materialPattern}
                      {mapping.alternateNames && mapping.alternateNames.length > 0 && (
                        <div className="text-sm text-gray-500">
                          Also: {mapping.alternateNames}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{mapping.activityName}</div>
                      {mapping.transform && (
                        <div className="text-sm text-gray-500">
                          Transform: {mapping.transform}
                        </div>
                      )}
                      {isSelected && (
                        <div className="text-xs text-primary mt-1">
                          Currently selected
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-center">{mapping.materialsCount || 0}</TableCell>
                    <TableCell className="text-center">{mapping.comment || 'No comment'}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={mapping.finalProduct ? 'default' : 'secondary'}>
                        {mapping.finalProduct ? 'Final' : 'Not Final'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant={isSelected ? "default" : "ghost"}
                        size="sm"
                        onClick={(e) => handleSelectMapping(mapping, e)}
                        disabled={isProcessing}
                        className={cn(
                          "min-w-[100px]",
                          isSelected && "cursor-default"
                        )}
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Selecting...
                          </>
                        ) : isSelected ? (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Selected
                          </>
                        ) : (
                          "Select"
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between border rounded-md p-4 bg-muted/30">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            {totalPages <= 7 ? (
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(page)}
                    disabled={loading}
                    className="w-8"
                  >
                    {page}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-1">
                {[
                  1,
                  currentPage - 1,
                  currentPage,
                  currentPage + 1,
                  totalPages
                ]
                  .filter((page) => page > 0 && page <= totalPages)
                  .filter((page, index, array) => array.indexOf(page) === index)
                  .map((page, index, array) => (
                    <Fragment key={page}>
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className="px-2 text-muted-foreground">...</span>
                      )}
                      <Button
                        variant={page === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => onPageChange(page)}
                        disabled={loading}
                        className="w-8"
                      >
                        {page}
                      </Button>
                    </Fragment>
                  ))}
              </div>
            )}
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
        </div>
      )}
    </div>
  );
} 