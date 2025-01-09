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
import {  CompletionLevel } from '../../components/products/completionLevel'


export const Route = createFileRoute('/products/list')({
  component: RouteComponent,
})

function RouteComponent() {

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await productsService.getAll();
      setProducts(products);
    };
    fetchProducts();
  }, []);

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [filters, setFilters] = useState<{
    category: string,
    search: string
  }>({
    category: '',
    search: ''
  })
  const itemsPerPage = 5
  
  const filteredProducts = products.filter(product => {
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
          <Link to="/products/steps/upload-file">
            Add Products
          </Link>
        </Button>
      </div>

      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Unit Footprint</TableHead>
            <TableHead>Total Footprint</TableHead>
            <TableHead>Completion Level</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedProducts.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{product.unitFootprint}</TableCell>
              <TableCell>{product.totalFootprint}</TableCell>
              <TableCell className="text-center">
                <CompletionLevel level={product.completionLevel} />
              </TableCell>
              <TableCell>
                <Button asChild>
                  <Link to={`/products/${product.id}`}>
                    Details
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-center gap-2 mt-4">
        <Button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="py-2">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </>
  )
}
