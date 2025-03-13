import { useEffect, useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/hooks/useProducts';
import { CompletionLevel } from '@/components/products/completionLevel';
import { MaterialStatusBadge } from '@/components/materials/MaterialStatusBadge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ReviewStatus } from '@/interfaces/product';
import { AdminPageLayout } from '@/components/admin/AdminPageLayout';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { SearchInput } from '@/components/admin/SearchInput';
import { AdminTable } from '@/components/admin/AdminTable';
import { AdminTableFooter } from '@/components/admin/AdminTableFooter';

export const Route = createFileRoute('/admin/products/')({
  component: ProductsPage,
});

function ProductsPage() {
  const { products, loading, total, fetchProducts } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState<ReviewStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchProducts({
      page: currentPage,
      pageSize,
      status: status === 'all' ? undefined : status,
      search: searchQuery || undefined,
    });
  }, [fetchProducts, currentPage, status, searchQuery]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value as ReviewStatus | 'all');
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns = [
    {
      header: 'Name',
      accessorKey: 'name' as const,
      className: 'font-medium',
    },
    {
      header: 'Reference',
      accessorKey: 'reference' as const,
    },
    {
      header: 'Category',
      accessorKey: 'category' as const,
    },
    {
      header: 'Customer',
      accessorKey: 'customer' as const,
      cell: (item: { customer?: { fullName: string, email: string } }) => (
        <div className="flex flex-col">
          {item.customer ? (
            <>
              <span className="font-medium">{item.customer.fullName}</span>
              <span className="text-xs text-muted-foreground">{item.customer.email}</span>
            </>
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </div>
      ),
    },
    {
      header: 'Completion',
      accessorKey: 'completionLevel' as const,
      className: 'text-center',
      cell: (item: { completionLevel: number }) => (
        <CompletionLevel level={item.completionLevel} />
      ),
    },
    {
      header: 'Status',
      accessorKey: 'review_status' as const,
      cell: (item: { review_status: ReviewStatus }) => (
        <MaterialStatusBadge status={item.review_status} />
      ),
    },
    {
      header: 'Actions',
      accessorKey: 'id' as const,
      className: 'text-right',
      cell: (item: { id: string }) => (
        <div className="flex justify-end gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
          >
            <Link
              to="/admin/products/$id"
              params={{ id: item.id }}
            >
              View
            </Link>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AdminPageLayout>
      <AdminPageHeader title="Products Management">
        <div className="flex items-center gap-2">
          <SearchInput
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <Select
            value={status}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="reviewed">Reviewed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </AdminPageHeader>

      <AdminTable
        data={products}
        columns={columns}
        loading={loading}
        searchQuery={searchQuery}
      />

      <AdminTableFooter
        total={total}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        itemsName="products"
      />
    </AdminPageLayout>
  );
} 