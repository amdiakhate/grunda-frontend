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
import { Badge } from '@/components/ui/badge';
import { adminService } from '@/services/admin';
import type { MaterialListItem, ReviewStatus } from '@/interfaces/admin';
import { Link } from '@tanstack/react-router';

const statusColors: Record<ReviewStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  reviewed: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

export function MaterialsList() {
  const [materials, setMaterials] = useState<MaterialListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [status, setStatus] = useState<ReviewStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        const response = await adminService.getMaterials({
          page,
          pageSize,
          status: status || undefined,
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
  }, [page, pageSize, status]);

  const handleStatusChange = (value: string) => {
    setStatus(value === 'all' ? null : value as ReviewStatus);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Materials Management</h1>
        <div className="flex gap-4">
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
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Activity</TableHead>
              <TableHead>Products Affected</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : materials.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No materials found
                </TableCell>
              </TableRow>
            ) : (
              materials.map((material) => (
                <TableRow
                  key={material.id}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <TableCell className="font-medium">{material.name}</TableCell>
                  <TableCell>{material.activityName || 'Not set'}</TableCell>
                  <TableCell>{material.product_affected}</TableCell>
                  <TableCell>
                    <Badge
                      className={statusColors[material.product_review_status]}
                      variant="outline"
                    >
                      {material.product_review_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(material.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Link
                      to="/admin/materials/$id"
                      params={{ id: material.id }}
                      className="inline-block"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                      >
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex justify-end">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {page} of {Math.ceil(total / pageSize)}
          </span>
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