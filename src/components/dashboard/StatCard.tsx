import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface StatCardProps {
  title: string
  value: number
  progress?: number
  progressLabel?: string
  subtitle?: string
  className?: string
  valueColor?: string
}

export function StatCard({
  title,
  value,
  progress,
  progressLabel,
  subtitle,
  className = '',
  valueColor = 'text-foreground'
}: StatCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${valueColor}`}>{value}</div>
        {progress !== undefined && (
          <>
            <Progress value={progress} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {progressLabel || `${progress.toFixed(1)}%`}
            </p>
          </>
        )}
        {subtitle && (
          <div className="text-xs text-muted-foreground mt-2">
            {subtitle}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 