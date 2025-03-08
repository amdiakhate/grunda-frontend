import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';
import type { MappingStatus } from '@/interfaces/admin';

interface MaterialMappingStatusBadgeProps {
  activityUuid?: string;
}

export function MaterialMappingStatusBadge({ activityUuid }: MaterialMappingStatusBadgeProps) {
  const status: MappingStatus = activityUuid ? 'mapped' : 'unmapped';

  if (status === 'mapped') {
    return (
      <Badge variant="success" className="flex items-center gap-1">
        <Check className="h-3 w-3" />
        Mapped
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="flex items-center gap-1">
      <X className="h-3 w-3" />
      Not Mapped
    </Badge>
  );
} 