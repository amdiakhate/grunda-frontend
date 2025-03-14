import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import {
  Table,
  TableRow,
  TableHead,
  TableHeader,
  TableBody,
  TableCell,
} from '../../components/ui/table'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { productsService } from '../../services/products'
import { Product } from '../../interfaces/product'
import { Loader2, Calendar, Box, ArrowUpRight } from 'lucide-react'
import { Badge } from '../../components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip'
import { formatDistanceToNow } from 'date-fns'
import { useAuthContext } from '../../contexts/AuthContext'

export const Route = createFileRoute('/products/list')({
  component: RouteComponent,
})

function RouteComponent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<{
    category: string,
    search: string
  }>({
    category: '',
    search: ''
  })
  
  // Get user role from auth context
  const { isAdmin } = useAuthContext();

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const products = await productsService.getAll();
        setProducts(products);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const itemsPerPage = 5
  
  const filteredProducts = products.filter(product => {
    // For customers, only show approved products
    if (!isAdmin && product.review_status !== 'reviewed') {
      return false;
    }
    
    const matchesCategory = !filters.category || product.category === filters.category
    const matchesSearch = !filters.search || 
      product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      product.id.toLowerCase().includes(filters.search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage)
  
  const categories = Array.from(new Set(products.map(p => p.category)))

  const formatValue = (value: number | undefined) => {
    if (value === undefined) return '-';
    return value.toFixed(2);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return 'Invalid date';
    }
  };

  const getCompletionBadge = (level: number) => {
    if (level === 100) {
      return <Badge variant="success">Complete</Badge>;
    } else if (level >= 75) {
      return <Badge variant="warning">Almost Complete</Badge>;
    } else if (level >= 50) {
      return <Badge variant="secondary">In Progress</Badge>;
    } else {
      return <Badge variant="destructive">Incomplete</Badge>;
    }
  };

  // Function to render review status badge
  const getReviewStatusBadge = (status: string) => {
    switch (status) {
      case 'reviewed':
        return <Badge variant="success">Approved</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending Review</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold">Products List</h1>
      <div className="flex gap-4 mb-4">
        <Input 
          placeholder="Search products..."
          value={filters.search}
          onChange={(e) => setFilters(prev => ({...prev, search: e.target.value}))}
          className="max-w-sm"
        />
        
        <select
          value={filters.category}
          onChange={(e) => setFilters(prev => ({...prev, category: e.target.value}))}
          className="border rounded p-2"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      <div className="flex justify-end mb-4">
        <Button asChild>
          <Link to="/products/steps/upload-file" className="flex items-center gap-2">
            <Box className="h-4 w-4" />
            Add Products
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-lg text-gray-600">Loading products...</p>
        </div>
      ) : (
        <>
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Product Information</TableHead>
                <TableHead className="w-[150px]">Category</TableHead>
                <TableHead className="w-[200px]">Environmental Impact</TableHead>
                <TableHead className="w-[150px]">Materials Status</TableHead>
                {isAdmin && <TableHead className="w-[150px]">Review Status</TableHead>}
                <TableHead className="w-[150px]">Last Updated</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{product.name}</span>
                        <span className="text-xs text-muted-foreground">ID: {product.id}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal">
                        {product.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="text-left">
                            <div className="flex flex-col">
                              <span>Unit: {formatValue(product.unitFootprint)}</span>
                              <span className="text-xs text-muted-foreground">
                                Total: {formatValue(product.totalFootprint)}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="space-y-1">
                              <div>
                                <span className="font-medium">Unit Footprint:</span> {formatValue(product.unitFootprint)}
                              </div>
                              <div>
                                <span className="font-medium">Total Footprint:</span> {formatValue(product.totalFootprint)}
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {getCompletionBadge(product.completionLevel)}
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary rounded-full h-2"
                            style={{ width: `${product.completionLevel}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    {isAdmin && (
                      <TableCell>
                        {getReviewStatusBadge(product.review_status)}
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {formatDate(product.updatedAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button asChild variant="default" size="sm">
                          <Link 
                            to="/products/detail" 
                            search={{ id: product.id }} 
                            className="flex items-center gap-2"
                          >
                            Details
                            <ArrowUpRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 7 : 6} className="text-center py-8 text-gray-500">
                    No products found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {filteredProducts.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="py-2">
                Page {currentPage} of {totalPages || 1}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(p => Math.min(totalPages || 1, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
