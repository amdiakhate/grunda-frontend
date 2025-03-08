import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search, Check } from 'lucide-react';
import { Pagination } from '@/components/ui/pagination';
import type { MaterialMapping } from '@/interfaces/materialMapping';

interface MaterialMappingListProps {
  mappings: MaterialMapping[];
  loading: boolean;
  onSelect: (mapping: MaterialMapping) => void;
  processingId: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  selectedId: string | null;
}

export function MaterialMappingList({
  mappings,
  loading,
  onSelect,
  processingId,
  searchQuery,
  onSearchChange,
  currentPage,
  totalPages,
  onPageChange,
  selectedId,
}: MaterialMappingListProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(localSearch);
  };

  const handleClearMapping = () => {
    onSelect({ 
      id: '', 
      materialPattern: '', 
      activityName: '', 
      finalProduct: false,
      alternateNames: [],
      referenceProduct: ''
    });
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search mappings..."
            className="pl-8"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>
        <Button type="submit">Search</Button>
      </form>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Material Pattern</TableHead>
              <TableHead>Activity</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  <div className="flex justify-center items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading mappings...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : mappings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No mappings found.
                </TableCell>
              </TableRow>
            ) : (
              mappings.map((mapping) => (
                <TableRow key={mapping.id} className={selectedId === mapping.id ? "bg-muted/50" : ""}>
                  <TableCell>{mapping.materialPattern}</TableCell>
                  <TableCell>{mapping.activityName}</TableCell>
                  <TableCell>
                    {mapping.finalProduct ? 'Final Product' : 'Intermediate'}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant={selectedId === mapping.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => onSelect(mapping)}
                      disabled={processingId !== null}
                    >
                      {processingId === mapping.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : selectedId === mapping.id ? (
                        <Check className="h-4 w-4 mr-1" />
                      ) : null}
                      {selectedId === mapping.id ? "Selected" : "Select"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedId && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearMapping}
            disabled={processingId !== null}
          >
            Clear Mapping
          </Button>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
} 