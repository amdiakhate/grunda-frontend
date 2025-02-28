import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface MaterialUsage {
  materialPattern: string
  count: number
}

interface MaterialsUsageProps {
  materials: MaterialUsage[]
  total: number
  className?: string
}

export function MaterialsUsage({ materials, total, className = '' }: MaterialsUsageProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Most Used Materials</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {materials.map((material) => (
            <div key={material.materialPattern} className="flex items-center">
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {material.materialPattern}
                </p>
                <p className="text-sm text-muted-foreground">
                  Used {material.count} time{material.count === 1 ? '' : 's'}
                </p>
              </div>
              <div className="ml-2">
                <Progress
                  value={(material.count / total) * 100}
                  className="w-[60px]"
                  indicatorClassName={`bg-primary-${Math.min(Math.ceil((material.count / total) * 6), 6)}00`}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 