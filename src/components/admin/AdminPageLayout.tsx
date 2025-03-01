import { cn } from '@/lib/utils';

interface AdminPageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function AdminPageLayout({ children, className }: AdminPageLayoutProps) {
  return (
    <div className={cn('space-y-6 p-6 bg-background', className)}>
      {children}
    </div>
  );
} 