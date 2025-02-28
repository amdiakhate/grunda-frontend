import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useProducts } from '@/hooks/useProducts';
import { Product, ReviewStatus } from '@/interfaces/product';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Progress } from '@radix-ui/react-progress';
import { CompletionLevel } from '../../../components/products/completionLevel';

export const Route = createFileRoute('/admin/products/')({
  component: ProductsPage,
});

function ProductsPage() {
  return (
    <ProtectedRoute requireAdmin>
      <ProductsList />
    </ProtectedRoute>
  );
}

const statusColors: Record<ReviewStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  reviewed: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

function ProductsList() {
  const { products, loading, total, reviewProduct, fetchProducts } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [comment, setComment] = useState('');
  const [reviewing, setReviewing] = useState(false);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<ReviewStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const pageSize = 10;

  useEffect(() => {
    fetchProducts({
      page,
      pageSize,
      status: status === 'all' ? undefined : status,
      search: search || undefined,
    });
  }, [fetchProducts, page, status, search]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
    fetchProducts({
      page: 1,
      pageSize,
      status: status === 'all' ? undefined : status,
      search: search || undefined,
    });
  };

  const handleReview = async (action: 'approve' | 'reject') => {
    if (!selectedProduct || reviewing) return;

    try {
      setReviewing(true);
      await reviewProduct(selectedProduct.id, {
        action,
        comment: comment.trim() || undefined,
      });
      setSelectedProduct(null);
      setComment('');
      // Refresh the list after review
      fetchProducts({
        page,
        pageSize,
        status: status === 'all' ? undefined : status,
        search: search || undefined,
      });
    } finally {
      setReviewing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products Management</h1>
        <div className="flex gap-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-[200px]"
            />
            <Button type="submit" variant="secondary">Search</Button>
          </form>
          <Select value={status} onValueChange={(value: ReviewStatus | 'all') => {
            setStatus(value);
            setPage(1);
          }}>
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
              <TableHead>Reference</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Completion Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.reference}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    <CompletionLevel level={product.completionLevel} />
                  </TableCell>

                  <TableCell>
                    <Badge
                      className={statusColors[product.review_status]}
                      variant="outline"
                    >
                      {product.review_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link
                        to="/admin/products/$id"
                        params={{ id: product.id }}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          View
                        </Button>
                      </Link>
                      {product.review_status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedProduct(product)}
                        >
                          Review
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Showing {products.length} of {total} products
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => p + 1)}
            disabled={page * pageSize >= total || loading}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Review Product Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Product</DialogTitle>
            <DialogDescription>
              {selectedProduct?.name} - {selectedProduct?.reference}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            <Textarea
              placeholder="Add a comment (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={reviewing}
            />
            
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setSelectedProduct(null)}
                disabled={reviewing}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleReview('reject')}
                disabled={reviewing}
              >
                {reviewing ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <XCircle className="h-4 w-4 mr-2" />
                )}
                Reject
              </Button>
              <Button
                onClick={() => handleReview('approve')}
                disabled={reviewing}
              >
                {reviewing ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Approve
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 