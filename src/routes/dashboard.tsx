import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Package, Factory, CheckCircle2, ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { api } from '../services/api'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'
import { Button } from '@/components/ui/button'
import { formatPercentage } from '@/utils/format'

interface DashboardOverview {
  totalProducts: {
    count: number
    categories: number
    pending: number
    reviewed: number
  }
  totalMaterials: {
    count: number
    description: string
  }
  completedProducts: {
    percentage: number
    pendingCalculations: number
  }
}

interface RecentProduct {
  id: string
  name: string
  category: string
}

interface DashboardData {
  overview: DashboardOverview
  recentProducts: RecentProduct[]
}

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  )
}

function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await api.get<DashboardData>('/customer/dashboard')
        setDashboardData(data)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading dashboard data...</div>
  }

  if (!dashboardData) {
    return null
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.overview.totalProducts.count}</div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{dashboardData.overview.totalProducts.categories} categories</span>
              <span>•</span>
              <span>{dashboardData.overview.totalProducts.pending} pending</span>
              <span>•</span>
              <span>{dashboardData.overview.totalProducts.reviewed} reviewed</span>
            </div>
          </CardContent>
        </Card>

        {/* Materials Count */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Materials</CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.overview.totalMaterials.count}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.overview.totalMaterials.description}
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
            <div className="text-2xl font-bold">{formatPercentage(dashboardData.overview.completedProducts.percentage)}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.overview.completedProducts.pendingCalculations} calculations pending
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Products */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardData.recentProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.category}</p>
                </div>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <Link to="/products/detail" search={{ id: product.id }}>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
