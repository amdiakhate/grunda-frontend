import { Badge } from '@/components/ui/badge';
import type { ReviewStatus } from '@/interfaces/admin';
import { cn } from '@/lib/utils';

interface MaterialStatusBadgeProps {
  status: ReviewStatus;
  className?: string;
}

const statusConfig: Record<ReviewStatus, { color: string; icon: string }> = {
  pending: {
    color: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
    icon: '⏳',
  },
  reviewed: {
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
    icon: '✓',
  },
  rejected: {
    color: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100',
    icon: '✕',
  },
};

export function MaterialStatusBadge({ status, className }: MaterialStatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge
      variant="outline"
      className={cn(
        'font-medium capitalize transition-colors',
        config.color,
        className
      )}
    >
      <span className="mr-1.5">{config.icon}</span>
      {status}
    </Badge>
  );
} 