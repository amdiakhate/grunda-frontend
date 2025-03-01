import { cn } from '@/lib/utils';

interface AdminPageHeaderProps {
  title: string;
  children?: React.ReactNode;
  className?: string;
}

export function AdminPageHeader({ title, children, className }: AdminPageHeaderProps) {
  return (
    <div className={cn('flex justify-between items-center', className)}>
      <h1 className="text-2xl font-semibold">{title}</h1>
      {children && (
        <div className="flex items-center gap-4">
          {children}
        </div>
      )}
    </div>
  );
} 