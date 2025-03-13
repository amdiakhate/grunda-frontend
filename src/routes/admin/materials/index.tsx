import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Link } from '@tanstack/react-router';
import { Loader2, Check, X, ArrowDown, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { adminService } from '@/services/admin';
import { AdminPageLayout } from '@/components/admin/AdminPageLayout';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { SearchInput } from '@/components/admin/SearchInput';
import { AdminTableFooter } from '@/components/admin/AdminTableFooter';
import type { RawMaterialListQueryParams } from '@/services/admin';

export const Route = createFileRoute('/admin/materials/')({
  component: MaterialsPage,
});

type SortField = 'name' | 'updatedAt' | 'products' | 'mappingStatus' | 'mapping';
type SortOrder = 'asc' | 'desc';

function MaterialsPage() {
  const [materials, setMaterials] = useState<Array<{
    id: string;
    name: string;
    description?: string;
    product_affected: number;
    isMapped: boolean;
    mappingId?: string;
    mappingInfo?: {
      materialPattern: string;
      activityName: string;
      finalProduct: boolean;
    };
    updatedAt: string;
    recentProducts?: Array<{
      id: string;
      name: string;
      reference: string;
      category: string;
      updatedAt: string;
      quantity: number;
      unit: string;
    }>;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<'all' | 'mapped' | 'unmapped'>('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const pageSize = 10;

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        
        // Préparer les paramètres en évitant les valeurs undefined
        const params: RawMaterialListQueryParams = {
          page: currentPage,
          limit: pageSize,
          sortBy: sortField,
          sortOrder: sortOrder
        };
        
        // Ajouter les paramètres optionnels seulement s'ils ont une valeur
        if (searchQuery) {
          params.search = searchQuery;
        }
        
        if (filter !== 'all') {
          params.mappingStatus = filter;
        }
        
        const response = await adminService.getRawMaterials(params);
        setMaterials(response.items);
        setTotal(response.total);
      } catch (error) {
        console.error('Failed to fetch materials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [currentPage, pageSize, searchQuery, filter, sortField, sortOrder]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (value: string) => {
    setFilter(value as 'all' | 'mapped' | 'unmapped');
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      // Toggle sort order if clicking on the same field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort field and default to ascending order
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const renderSortIcon = (field: SortField) => {
    if (field !== sortField) return null;
    
    return sortOrder === 'asc' ? (
      <ArrowUp className="ml-1 h-4 w-4 inline" />
    ) : (
      <ArrowDown className="ml-1 h-4 w-4 inline" />
    );
  };

  return (
    <AdminPageLayout>
      <AdminPageHeader title="Materials Management">
        <div className="flex items-center gap-2">
          <SearchInput
            placeholder="Search materials..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <Select
            value={filter}
            onValueChange={handleFilterChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All materials</SelectItem>
              <SelectItem value="mapped">Mapped</SelectItem>
              <SelectItem value="unmapped">Unmapped</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </AdminPageHeader>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead 
                className="cursor-pointer hover:bg-muted/70"
                onClick={() => handleSort('name')}
              >
                Name {renderSortIcon('name')}
              </TableHead>
              <TableHead 
                className="text-center cursor-pointer hover:bg-muted/70"
                onClick={() => handleSort('products')}
              >
                Products {renderSortIcon('products')}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/70"
                onClick={() => handleSort('mappingStatus')}
              >
                Mapping Status {renderSortIcon('mappingStatus')}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/70"
                onClick={() => handleSort('mapping')}
              >
                Mapping {renderSortIcon('mapping')}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/70"
                onClick={() => handleSort('updatedAt')}
              >
                Last Updated {renderSortIcon('updatedAt')}
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    <span className="text-muted-foreground">Loading materials...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : materials.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <p className="text-muted-foreground">No materials found</p>
                    {searchQuery && (
                      <p className="text-sm text-muted-foreground">
                        Try adjusting your search or filter criteria
                      </p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              materials.map((material) => (
                <TableRow
                  key={material.id}
                  className={cn(
                    "group transition-colors hover:bg-muted/50",
                    !material.isMapped && 'bg-amber-50/30'
                  )}
                >
                  <TableCell className="font-medium">{material.name}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{material.product_affected}</Badge>
                  </TableCell>
                  <TableCell>
                    {material.isMapped ? (
                      <Badge variant="success" className="flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        Mapped
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <X className="h-3 w-3" />
                        Not Mapped
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {material.mappingInfo ? (
                      <div className="text-sm">
                        <div className="font-medium">{material.mappingInfo.materialPattern}</div>
                        <div className="text-xs text-muted-foreground">{material.mappingInfo.activityName}</div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">Not mapped</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(material.updatedAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      to="/admin/materials/$id"
                      params={{ id: material.id }}
                      className="inline-block"
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        View details
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AdminTableFooter
        total={total}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        itemsName="materials"
      />
    </AdminPageLayout>
  );
} 