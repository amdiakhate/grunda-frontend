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
import { Loader2, Calendar, Box, ArrowUpRight, Scale } from 'lucide-react'
import { Badge } from '../../components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip'
import { formatDistanceToNow } from 'date-fns'
import { useAuthContext } from '../../contexts/AuthContext'

// Liste des méthodes d'impact disponibles
const impactMethods = [
  { id: 'climate change', label: 'Climate change', unit: 'kg CO2-Eq' },
  { id: 'acidification', label: 'Acidification', unit: 'mol H+-Eq' },
  { id: 'ecotoxicity: freshwater', label: 'Ecotoxicity', unit: 'CTUe' },
  { id: 'eutrophication: freshwater', label: 'Eutrophication (freshwater)', unit: 'kg P-Eq' },
  { id: 'eutrophication: marine', label: 'Eutrophication (marine)', unit: 'kg N-Eq' },
  { id: 'eutrophication: terrestrial', label: 'Eutrophication (terrestrial)', unit: 'mol N-Eq' },
  { id: 'human toxicity: carcinogenic', label: 'Human toxicity (cancer)', unit: 'CTUh' },
  { id: 'human toxicity: non-carcinogenic', label: 'Human toxicity (non-cancer)', unit: 'CTUh' },
  { id: 'ionising radiation: human health', label: 'Ionising radiation', unit: 'kBq U235-Eq' },
  { id: 'land use', label: 'Land use', unit: 'dimensionless' },
  { id: 'ozone depletion', label: 'Ozone depletion', unit: 'kg CFC-11-Eq' },
  { id: 'particulate matter formation', label: 'Particulate matter', unit: 'disease incidence' },
  { id: 'photochemical oxidant formation: human health', label: 'Photochemical oxidation', unit: 'kg NMVOC-Eq' },
  { id: 'energy resources: non-renewable', label: 'Energy resources', unit: 'MJ, net calorific value' },
  { id: 'material resources: metals/minerals', label: 'Material resources', unit: 'kg Sb-Eq' },
  { id: 'water use', label: 'Water use', unit: 'm3 world Eq deprived' },
];

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
  const [selectedImpactMethod, setSelectedImpactMethod] = useState('climate change');
  
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

  const getImpactValue = (product: Product, method: string) => {
    if (!product.summary || !product.summary.impacts) return undefined;
    
    const impact = product.summary.impacts.find(
      impact => impact.method === method
    );
    
    return impact?.value;
  };

  const getImpactUnit = (method: string) => {
    const impactMethod = impactMethods.find(m => m.id === method);
    return impactMethod?.unit || '';
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

  return (
    <>
      <h1 className="text-2xl font-bold">Products List</h1>
      <div className="flex flex-wrap gap-4 mb-4">
        <Input 
          placeholder="Search products..."
          value={filters.search}
          onChange={(e) => setFilters(prev => ({...prev, search: e.target.value}))}
          className="max-w-sm"
        />
        
        <div className="flex items-center gap-2">
          <select
            value={filters.category}
            onChange={(e) => setFilters(prev => ({...prev, category: e.target.value}))}
            className="border rounded p-2"
          >
            <option value="">All categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <div className="flex items-center border rounded p-2">
            <Scale className="h-4 w-4 mr-2 text-muted-foreground" />
            <select
              value={selectedImpactMethod}
              onChange={(e) => setSelectedImpactMethod(e.target.value)}
              className="bg-transparent border-none focus:outline-none"
            >
              {impactMethods.map(method => (
                <option key={method.id} value={method.id}>{method.label}</option>
              ))}
            </select>
          </div>
        </div>
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
                <TableHead>Product name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Popularity</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Upload date</TableHead>
                <TableHead>
                  {impactMethods.find(m => m.id === selectedImpactMethod)?.label || 'Environmental impact'}
                </TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                          {product.category && (
                            <img 
                              src={`/product-images/${product.category.toLowerCase().replace(/\s+/g, '-')}.svg`}
                              alt={product.category}
                              className="w-8 h-8 object-contain"
                              onError={(e) => {
                                // Utiliser une référence statique pour éviter les boucles infinies
                                (e.target as HTMLImageElement).onerror = null;
                                (e.target as HTMLImageElement).src = "/product-images/default.svg";
                              }}
                            />
                          )}
                        </div>
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal">
                        {product.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary rounded-full h-2"
                          style={{ width: `${product.completionLevel}%` }}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">{product.reference}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {formatDate(product.updatedAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="text-left">
                            <div className="flex items-center">
                              <span>
                                {formatValue(getImpactValue(product, selectedImpactMethod))} {getImpactUnit(selectedImpactMethod)}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="space-y-1">
                              <div>
                                <span className="font-medium">{impactMethods.find(m => m.id === selectedImpactMethod)?.label || selectedImpactMethod}:</span> {formatValue(getImpactValue(product, selectedImpactMethod))} {getImpactUnit(selectedImpactMethod)}
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
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
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
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
