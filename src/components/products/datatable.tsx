import {
    Table,
    TableRow,
    TableHead,
    TableHeader,
    TableBody,
    TableCell,
  } from '../ui/table'
import { Product } from '../../interfaces/product'
import { Badge } from '../ui/badge'
import { SortableHeader } from '../ui/sortable-header'
import { sortItems } from '@/utils/sorting'
import { useState } from 'react'

export interface DataTableProps {
    data: Product
}

export function DataTable({ data }: DataTableProps) {
    const [sortConfig, setSortConfig] = useState<{
        key: string
        direction: 'asc' | 'desc' | null
    }>({
        key: '',
        direction: null,
    })

    const sortedMaterials = sortItems(data.materials, sortConfig)

    const handleSort = (key: string) => {
        setSortConfig((current) => {
            if (current.key === key) {
                if (current.direction === 'asc') {
                    return { key, direction: 'desc' }
                }
                if (current.direction === 'desc') {
                    return { key: '', direction: null }
                }
            }
            return { key, direction: 'asc' }
        })
    }

    const formatQuantity = (quantity: number | undefined) => {
        if (quantity === undefined) return '-'
        return quantity.toFixed(2)
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            <SortableHeader
                                column="name"
                                label="Material Name"
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
                        <TableHead>Unit</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedMaterials.map((material) => (
                        <TableRow key={material.id}>
                            <TableCell>{material.name}</TableCell>
                            <TableCell>{formatQuantity(material.quantity)}</TableCell>
                            <TableCell>{material.unit}</TableCell>
                            <TableCell>
                                <Badge
                                    variant={material.status === 'pending' ? 'warning' : 'success'}
                                >
                                    {material.status}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}