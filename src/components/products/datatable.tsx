import { useState } from 'react'
import {
    Table,
    TableRow,
    TableHead,
    TableHeader,
    TableBody,
    TableCell,
  } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { SortableHeader, SortConfig } from '@/components/ui/sortable-header'
import { MaterialImpacts } from '@/components/products/MaterialImpacts'
import { useStore } from '@/stores/useStore'
import { Product } from '@/interfaces/product'

export interface DataTableProps {
    data: Product
}

export function DataTable({ data }: DataTableProps) {
    const { displayedImpact } = useStore();
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        key: 'name',
        direction: 'asc'
    });

    const sortedMaterials = [...data.productMaterials].sort((a, b) => {
        if (sortConfig.key === 'name') {
            return sortConfig.direction === 'asc'
                ? a.material.name.localeCompare(b.material.name)
                : b.material.name.localeCompare(a.material.name);
        }
        
        if (sortConfig.key === 'quantity') {
            const aValue = a.quantity || 0;
            const bValue = b.quantity || 0;
            return sortConfig.direction === 'asc'
                ? aValue - bValue
                : bValue - aValue;
        }
        
        if (sortConfig.key === 'activity') {
            const aValue = a.activityName || '';
            const bValue = b.activityName || '';
            return sortConfig.direction === 'asc'
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        }
        
        return 0;
    });

    const handleSort = (key: string) => {
        setSortConfig(prevConfig => ({
            key,
            direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const formatQuantity = (quantity: number | undefined) => {
        if (quantity === undefined) return '-'
        return quantity.toString()
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            <SortableHeader
                                column="name"
                                label="Material"
                                sortConfig={sortConfig}
                                onSort={handleSort}
                            />
                        </TableHead>
                        <TableHead>
                            <SortableHeader
                                column="quantity"
                                label="Quantity"
                                sortConfig={sortConfig}
                                onSort={handleSort}
                            />
                        </TableHead>
                        <TableHead>
                            <SortableHeader
                                column="activity"
                                label="Activity"
                                sortConfig={sortConfig}
                                onSort={handleSort}
                            />
                        </TableHead>
                        <TableHead>Origin</TableHead>
                        {displayedImpact && <TableHead>Impacts</TableHead>}
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedMaterials.map((material) => (
                        <TableRow key={material.id}>
                            <TableCell className="font-medium">
                                {material.material.name}
                            </TableCell>
                            <TableCell>
                                {formatQuantity(material.quantity)} {material.unit}
                            </TableCell>
                            <TableCell>
                                {material.activityName || 'Not mapped'}
                            </TableCell>
                            <TableCell>
                                <div className="space-y-1">
                                    {material.material_origin && (
                                        <Badge variant="outline" className="text-xs">
                                            Material: {material.material_origin}
                                        </Badge>
                                    )}
                                    {material.assembling_location && (
                                        <Badge variant="outline" className="text-xs">
                                            Assembly: {material.assembling_location}
                                        </Badge>
                                    )}
                                </div>
                            </TableCell>
                            {displayedImpact && (
                                <TableCell>
                                    {material.impacts && (
                                        <MaterialImpacts impacts={material.impacts} />
                                    )}
                                </TableCell>
                            )}
                            <TableCell>
                                <Badge
                                    variant={material.completion ? 'success' : 'warning'}
                                >
                                    {material.completion ? 'Complete' : 'Pending'}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}