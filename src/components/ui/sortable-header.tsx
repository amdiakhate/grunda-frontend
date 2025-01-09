import { TableHead } from "@/components/ui/table";
import { ChevronUp, ChevronDown } from 'lucide-react';

export type SortDirection = 'asc' | 'desc' | null;

export interface SortConfig {
    key: string;
    direction: SortDirection;
}

interface SortableHeaderProps {
    column: string;
    label: string;
    sortConfig: SortConfig;
    onSort: (key: string) => void;
}

export function SortableHeader({ column, label, sortConfig, onSort }: SortableHeaderProps) {
    return (
        <TableHead 
            onClick={() => onSort(column)}
            className="cursor-pointer hover:bg-muted/50"
        >
            <div className="flex items-center gap-2">
                {label}
                {sortConfig.key === column && (
                    <span className="text-muted-foreground">
                        {sortConfig.direction === 'asc' ? (
                            <ChevronUp className="h-4 w-4" />
                        ) : (
                            <ChevronDown className="h-4 w-4" />
                        )}
                    </span>
                )}
            </div>
        </TableHead>
    );
} 