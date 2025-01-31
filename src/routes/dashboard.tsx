import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Package, Factory, Atom, ArrowUpIcon, ArrowDownIcon, CheckCircle2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { productsService } from '../services/products'
import { Product } from '../interfaces/product'
import { MaterialsTreemap } from '../components/products/materialsTreemap'

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productsService.getAll()
        setProducts(data)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Calculate statistics
  const stats = {
    totalProducts: products.length,
    categories: new Set(products.map(p => p.category)).size,
    completedProducts: products.filter(p => p.completionLevel === 100).length,
    avgFootprint: products.reduce((acc, p) => acc + (p.unitFootprint || 0), 0) / products.length || 0,
    pendingCalculations: products.filter(p => p.calculation_status === 'pending').length,
    materialsCount: products.reduce((acc, p) => acc + p.materials.length, 0),
  }

  // Get top impacting categories
  const categoryImpacts = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = 0
    }
    acc[product.category] += product.totalFootprint || 0
    return acc
  }, {} as Record<string, number>)

  const topCategories = Object.entries(categoryImpacts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading dashboard data...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Across {stats.categories} categories
            </p>
          </CardContent>
        </Card>

        {/* Materials Count */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Materials</CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.materialsCount}</div>
            <p className="text-xs text-muted-foreground">
              Used across all products
            </p>
          </CardContent>
        </Card>

        {/* Completion Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Products</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((stats.completedProducts / stats.totalProducts) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingCalculations} calculations pending
            </p>
          </CardContent>
        </Card>

        {/* Average Impact */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Product Impact</CardTitle>
            <Atom className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgFootprint.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              kg CO₂e per unit
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Category Impact Analysis */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Impacting Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCategories.map(([category, impact], index) => (
                <div key={category} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{category}</p>
                    <p className="text-2xl font-bold">{impact.toFixed(1)} kg CO₂e</p>
                  </div>
                  <div className={`h-4 w-4 rounded-full ${
                    index === 0 ? 'bg-red-100' :
                    index === 1 ? 'bg-yellow-100' :
                    'bg-green-100'
                  }`} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Products */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.slice(-3).map(product => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.category}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {product.unitFootprint?.toFixed(1) || '...'} kg CO₂e
                    </span>
                    {product.unitFootprint && (product.unitFootprint > stats.avgFootprint ? (
                      <ArrowUpIcon className="h-4 w-4 text-red-500" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4 text-green-500" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Materials Impact Overview */}
      {products.length > 0 && products[0].materials.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Materials Impact Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <MaterialsTreemap materials={products[0].materials} threshold={1} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
