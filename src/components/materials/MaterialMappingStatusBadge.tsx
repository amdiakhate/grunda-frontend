import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';
import type { MappingStatus } from '@/interfaces/admin';

interface MaterialMappingStatusBadgeProps {
  activityName?: string;
}

export function MaterialMappingStatusBadge({ activityName }: MaterialMappingStatusBadgeProps) {
  const status: MappingStatus = activityName !== "" ? 'mapped' : 'unmapped';

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