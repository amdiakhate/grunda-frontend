import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Column<T> {
  header: string;
  accessorKey: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
}

interface AdminTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  searchQuery?: string;
  className?: string;
}

export function AdminTable<T>({
  data,
  columns,
  loading,
  emptyMessage = 'No items found',
  searchQuery,
  className,
}: AdminTableProps<T>) {
  return (
    <div className={cn('rounded-md border bg-white', className)}>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            {columns.map((column) => (
              <TableHead
                key={String(column.accessorKey)}
                className={cn('font-medium', column.className)}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24">
                <div className="flex justify-center items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  <span className="text-muted-foreground">Loading...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24">
                <div className="flex flex-col items-center justify-center text-center gap-2">
                  <p className="text-muted-foreground">{emptyMessage}</p>
                  {searchQuery && (
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your search criteria
                    </p>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => (
              <TableRow key={index} className="hover:bg-muted/50">
                {columns.map((column) => (
                  <TableCell
                    key={String(column.accessorKey)}
                    className={column.className}
                  >
                    {column.cell
                      ? column.cell(item)
                      : String(item[column.accessorKey] ?? '')}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
} 