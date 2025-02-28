import { useEffect, useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { MaterialStatusBadge } from './MaterialStatusBadge';
import { adminService } from '@/services/admin';
import type { MaterialListItem, ReviewStatus } from '@/interfaces/admin';
import { Link } from '@tanstack/react-router';
import { Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function MaterialsList() {
  const [materials, setMaterials] = useState<MaterialListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [status, setStatus] = useState<ReviewStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        const response = await adminService.getMaterials({
          page,
          pageSize,
          status: status || undefined,
          search: searchQuery || undefined,
        });
        setMaterials(response.items);
        setTotal(response.total);
      } catch (error) {
        console.error('Failed to fetch materials:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchMaterials, 300);
    return () => clearTimeout(debounceTimer);
  }, [page, pageSize, status, searchQuery]);

  const handleStatusChange = (value: string) => {
    setStatus(value === 'all' ? null : value as ReviewStatus);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">Materials Management</h1>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-[200px]"
            />
          </div>
          <Select value={status || "all"} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="reviewed">Reviewed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Name</TableHead>
              <TableHead>Activity</TableHead>
              <TableHead className="text-center">Products Affected</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    <span className="text-muted-foreground">Loading materials...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : materials.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
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
                    material.product_review_status === 'pending' && 'bg-amber-50/30',
                    material.product_review_status === 'rejected' && 'bg-rose-50/30'
                  )}
                >
                  <TableCell className="font-medium">{material.name}</TableCell>
                  <TableCell>{material.activityName || 'Not set'}</TableCell>
                  <TableCell className="text-center">{material.product_affected}</TableCell>
                  <TableCell>{material.userName || 'Not set'}</TableCell>
                  <TableCell>
                    <MaterialStatusBadge status={material.product_review_status} />
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

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {materials.length} of {total} materials
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">Page</span>
            <span className="text-sm text-muted-foreground">
              {page} of {Math.ceil(total / pageSize)}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= Math.ceil(total / pageSize)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
} 