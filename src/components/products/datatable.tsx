import {
    Table,
    TableRow,
    TableHead,
    TableHeader,
    TableBody,
    TableCell,
  } from '../../components/ui/table'
import { Product } from '../../interfaces/product';
import { CompletionLevel } from './completionLevel';

export function DataTable({ data }: { data: Product }) {


    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {/* product material details */}
                    <TableHead>Name</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Origin</TableHead>
                    <TableHead>Activity UUID</TableHead>
                    <TableHead>Activity Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Reference Product</TableHead>
                    <TableHead>Completion</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {data.materials.map((material, index) => (
                    <TableRow key={index}>
                        <TableCell className="font-bold">{material.name}</TableCell>
                        <TableCell>{material.quantity}</TableCell>
                        <TableCell>{material.unit}</TableCell>
                        <TableCell>{material.origin}</TableCell>
                        {/* <TableCell>{material.description}</TableCell> */}
                        <TableCell>{material.activityUuid}</TableCell>
                        <TableCell>{material.activityName}</TableCell>
                        <TableCell>{material.category}</TableCell>
                        <TableCell>{material.referenceProduct}</TableCell>
                        <TableCell className="text-center">
                            <CompletionLevel level={material.completion ? 100 : 0} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )

}