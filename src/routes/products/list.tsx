import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
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

// product caracteristics : name, id  , category name,  unit footprint , total footprint
type Product = {
  id: string
  name: string
  category: string
  unitFootprint: number // CO2 equivalent in kg
  totalFootprint: number // CO2 equivalent in kg
}

const initialProducts: Product[] = [
  {
    id: 'f1',
    name: 'Modern Office Chair',
    category: 'Seating',
    unitFootprint: 48.5,
    totalFootprint: 4850,
  },
  {
    id: 'f2',
    name: 'Wooden Dining Table',
    category: 'Tables',
    unitFootprint: 125.3,
    totalFootprint: 12530,
  },
  {
    id: 'f3',
    name: 'Leather Sofa',
    category: 'Seating',
    unitFootprint: 210.8,
    totalFootprint: 21080,
  },
  {
    id: 'f4',
    name: 'Bookshelf',
    category: 'Storage',
    unitFootprint: 85.2,
    totalFootprint: 8520,
  },
  {
    id: 'f5',
    name: 'Queen Size Bed Frame',
    category: 'Bedroom',
    unitFootprint: 178.4,
    totalFootprint: 17840,
  },
  {
    id: 'f6',
    name: 'Coffee Table',
    category: 'Tables',
    unitFootprint: 62.7,
    totalFootprint: 6270,
  },
  {
    id: 'f7',
    name: 'Wardrobe Cabinet',
    category: 'Storage',
    unitFootprint: 245.9,
    totalFootprint: 24590,
  },
  {
    id: 'f8',
    name: 'Desk Lamp',
    category: 'Lighting',
    unitFootprint: 12.3,
    totalFootprint: 1230,
  },
  {
    id: 'f9',
    name: 'Side Table',
    category: 'Tables',
    unitFootprint: 35.6,
    totalFootprint: 3560,
  },
  {
    id: 'f10',
    name: 'TV Stand',
    category: 'Storage',
    unitFootprint: 95.4,
    totalFootprint: 9540,
  },
]

export const Route = createFileRoute('/products/list')({
  component: RouteComponent,
})

function RouteComponent() {

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [filters, setFilters] = useState<{
    category: string,
    search: string
  }>({
    category: '',
    search: ''
  })
  const itemsPerPage = 5
  
  const filteredProducts = initialProducts.filter(product => {
    const matchesCategory = !filters.category || product.category === filters.category
    const matchesSearch = !filters.search || 
      product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      product.id.toLowerCase().includes(filters.search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage)
  
  const categories = Array.from(new Set(initialProducts.map(p => p.category)))

  return (
    <>
      <h1>Products List</h1>
      
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

      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Unit Footprint</TableHead>
            <TableHead>Total Footprint</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedProducts.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.id}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{product.unitFootprint}</TableCell>
              <TableCell>{product.totalFootprint}</TableCell>
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
