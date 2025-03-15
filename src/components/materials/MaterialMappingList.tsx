import { useState, useEffect, useRef } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search, Check, X } from 'lucide-react';
import { Pagination } from '@/components/ui/pagination';
import type { MaterialMapping } from '@/interfaces/materialMapping';
import { debounce } from '@/lib/utils';

interface MaterialMappingListProps {
  mappings: MaterialMapping[];
  loading: boolean;
  onSelect: (mapping: MaterialMapping) => void;
  processingId: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  selectedId: string | null;
  disabled?: boolean;
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
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  selectedId,
  disabled = false,
}: MaterialMappingListProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery);
  
  // Créer une fonction debounce typée correctement
  const debouncedSearch = useRef<(value: string) => void>(
    debounce((value: unknown) => {
      onSearchChange(value as string);
    }, 300)
  ).current;

  // Mettre à jour la recherche locale lorsque searchQuery change
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  // Déclencher la recherche à chaque frappe
  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    debouncedSearch(value);
  };

  // Effacer la recherche
  const handleClearSearch = () => {
    setLocalSearch('');
    onSearchChange('');
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

  // Calculer les indices des éléments affichés
  const startIndex = mappings.length > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endIndex = mappings.length > 0 ? startIndex + mappings.length - 1 : 0;

  // Déterminer s'il y a des données à afficher
  const hasData = !loading && mappings.length > 0;

  // Utiliser le nombre total d'éléments fourni par le backend
  const actualTotalItems = totalItems || 0;

  return (
    <div className="space-y-4">
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search mappings..."
            className="pl-8 pr-8"
            value={localSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            disabled={disabled || loading}
          />
          {localSearch && (
            <button 
              className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground"
              onClick={handleClearSearch}
              disabled={disabled || loading}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

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
                  {searchQuery ? (
                    <div className="flex flex-col items-center gap-2">
                      <p>No mappings found for "{searchQuery}"</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleClearSearch}
                        disabled={disabled}
                      >
                        Clear search
                      </Button>
                    </div>
                  ) : (
                    <p>No mappings found.</p>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              mappings.map((mapping) => (
                <TableRow key={mapping.id} className={selectedId === mapping.id ? "bg-muted/50" : ""}>
                  <TableCell className="font-medium">{mapping.materialPattern}</TableCell>
                  <TableCell>{mapping.activityName}</TableCell>
                  <TableCell>
                    {mapping.finalProduct ? 'Final Product' : 'Intermediate'}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant={selectedId === mapping.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => onSelect(mapping)}
                      disabled={processingId !== null || disabled}
                      className="w-full"
                    >
                      {processingId === mapping.id ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
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

      {/* {selectedId && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearMapping}
            disabled={processingId !== null || disabled}
          >
            Clear Mapping
          </Button>
        </div>
      )} */}

      {/* Toujours afficher la pagination avec les informations sur le nombre total d'éléments */}
      <div className="flex flex-col space-y-2">
        <div className="text-sm text-muted-foreground text-right">
          {hasData ? (
            <>Showing {startIndex}-{endIndex} of {actualTotalItems} mappings</>
          ) : (
            <>No mappings found</>
          )}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={Math.max(1, totalPages)}
          onPageChange={onPageChange}
          disabled={disabled || loading}
        />
      </div>
    </div>
  );
} 