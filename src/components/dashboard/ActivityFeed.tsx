import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { formatDate } from '@/lib/utils'
import { FileText, Box } from 'lucide-react'

interface Activity {
  type: string
  action: string
  itemId: string
  itemName: string
  date: string
}

interface ActivityFeedProps {
  activities: Activity[]
  className?: string
}

const actionColors: Record<string, string> = {
  Created: 'text-green-600',
  Approved: 'text-blue-600',
  Rejected: 'text-red-600',
}

export function ActivityFeed({ activities, className = '' }: ActivityFeedProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {activities.map((activity, i) => (
              <div key={i} className="flex items-center">
                <Avatar className="h-9 w-9 bg-muted">
                  <AvatarFallback className="bg-primary/10">
                    {activity.type === 'product' ? (
                      <FileText className="h-4 w-4 text-primary" />
                    ) : (
                      <Box className="h-4 w-4 text-primary" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.itemName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className={actionColors[activity.action] || 'text-foreground'}>
                      {activity.action}
                    </span>
                    {' • '}
                    {formatDate(activity.date)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
} 