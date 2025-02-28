import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { adminService, type DashboardStats } from '@/services/admin'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'
import { StatCard } from '@/components/dashboard/StatCard'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import { MaterialsUsage } from '@/components/dashboard/MaterialsUsage'
import { CustomersList } from '@/components/dashboard/CustomersList'

export const Route = createFileRoute('/admin/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getDashboardStats()
        setStats(data)
      } catch (error) {
        if (error instanceof Error) {
          toast({
            title: 'Error',
            description: error.message,
            variant: 'destructive',
          })
        } else {
          toast({
            title: 'Error',
            description: 'Failed to load dashboard statistics',
            variant: 'destructive',
          })
        }
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [toast])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!stats) {
    return null
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Products"
          value={stats.products.total}
          progress={stats.products.completionRate}
          progressLabel={`${stats.products.completionRate.toFixed(1)}% reviewed`}
          valueColor="text-blue-600"
        />
        <StatCard
          title="Materials"
          value={stats.materials.total}
          progress={stats.materials.mappingRate}
          progressLabel={`${stats.materials.mappingRate.toFixed(1)}% mapped`}
          valueColor="text-emerald-600"
        />
        <StatCard
          title="Users"
          value={stats.users.total}
          subtitle={`${stats.users.admins} admins • ${stats.users.customers} customers`}
          valueColor="text-violet-600"
        />
        <StatCard
          title="Mappings"
          value={stats.mappings.total}
          subtitle={`${stats.mappings.mostUsed.length} unique patterns`}
          valueColor="text-amber-600"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-4 md:grid-cols-2">
        <MaterialsUsage
          materials={stats.mappings.mostUsed}
          total={stats.mappings.total}
        />
        <ActivityFeed activities={stats.recentActivity} />
      </div>

      {/* Active Customers */}
      <CustomersList customers={stats.users.customerStats} />
    </div>
  )
}
