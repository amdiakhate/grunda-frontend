import {
    Table,
    TableRow,
    TableHead,
    TableHeader,
    TableBody,
    TableCell,
  } from '../../components/ui/table'
import { Material, Product } from '../../interfaces/product';
import { CompletionLevel } from './completionLevel';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ActivitySearchModal } from './activitySearchModal';
import { EcoinventActivity } from '@/interfaces/ecoinvent';

export function DataTable({ data }: { data: Product }) {
    const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleActivitySelect = async (activity: EcoinventActivity) => {
        // Ici, vous pouvez implémenter la logique pour mettre à jour le matériau
        console.log('Selected activity:', activity);
        setIsModalOpen(false);
    };

    return (
        <>
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
                                {material.completion === true ? <CompletionLevel level={100} /> : <CompletionLevel level={0} />}
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setSelectedMaterial(material);
                                        setIsModalOpen(true);
                                    }}
                                >
                                    Search Activity
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {selectedMaterial && (
                <ActivitySearchModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSelect={handleActivitySelect}
                    material={selectedMaterial}
                />
            )}
        </>
    )

}