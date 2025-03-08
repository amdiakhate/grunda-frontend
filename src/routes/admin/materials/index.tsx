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
import { Loader2, Search, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { adminService } from '@/services/admin';
import { AdminPageLayout } from '@/components/admin/AdminPageLayout';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { SearchInput } from '@/components/admin/SearchInput';
import { AdminTableFooter } from '@/components/admin/AdminTableFooter';

export const Route = createFileRoute('/admin/materials/')({
  component: MaterialsPage,
});

function MaterialsPage() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<'all' | 'mapped' | 'unmapped'>('all');
  const pageSize = 10;

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        const response = await adminService.getRawMaterials({
          page: currentPage,
          pageSize,
          search: searchQuery || undefined,
          mapped: filter === 'all' ? undefined : filter === 'mapped',
        });
        setMaterials(response.items);
        setTotal(response.total);
      } catch (error) {
        console.error('Failed to fetch materials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [currentPage, pageSize, searchQuery, filter]);

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
              <TableHead>Name</TableHead>
              <TableHead className="text-center">Products</TableHead>
              <TableHead>Mapping Status</TableHead>
              <TableHead>Mapping</TableHead>
              <TableHead>Last Updated</TableHead>
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