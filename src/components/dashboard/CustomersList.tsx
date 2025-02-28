import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface Customer {
  id: string
  name: string
  productsCount: number
  pendingReviews: number
  lastActivity: string
}

interface CustomersListProps {
  customers: Customer[]
  className?: string
}

export function CustomersList({ customers, className = '' }: CustomersListProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Active Customers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {customers.map((customer) => (
            <div key={customer.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {customer.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium leading-none">
                    {customer.name}
                  </p>
                  {customer.pendingReviews > 0 && (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                      {customer.pendingReviews} pending
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {customer.productsCount} product{customer.productsCount === 1 ? '' : 's'}
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                Last active: {formatDate(customer.lastActivity)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 