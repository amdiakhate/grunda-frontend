import { Pagination } from '@/components/ui/pagination';
import { cn } from '@/lib/utils';

interface AdminTableFooterProps {
  total: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsName?: string;
  className?: string;
}

export function AdminTableFooter({
  total,
  pageSize,
  currentPage,
  onPageChange,
  itemsName = 'items',
  className,
}: AdminTableFooterProps) {
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, total);

  return (
    <div className={cn('flex items-center justify-between', className)}>
      <p className="text-sm text-muted-foreground">
        Showing {start}-{end} of {total} {itemsName}
      </p>
      <Pagination
        total={total}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />
    </div>
  );
} 