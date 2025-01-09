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
import { materialsService } from '../../services/materials';
import {   useToast } from '../../hooks/use-toast';
import { Toaster } from '../ui/toaster';
import { productsService } from '@/services/products';
import { useSort } from '@/hooks/use-sort';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function DataTable({ data }: { data: Product }) {
    const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productData, setProductData] = useState<Product>(data);
    const { toast } = useToast();
    const [sortConfig, setSortConfig] = useState<{key: string; direction: 'asc' | 'desc' | null}>({
        key: '',
        direction: null
    });

    const sortedMaterials = useSort(productData.materials, sortConfig);

    const handleSort = (key: string) => {
        setSortConfig(current => {
            if (current.key === key) {
                if (current.direction === 'asc') {
                    return { key, direction: 'desc' };
                }
                if (current.direction === 'desc') {
                    return { key: '', direction: null };
                }
            }
            return { key, direction: 'asc' };
        });
    };

    const SortableHeader = ({ column, label }: { column: string; label: string }) => {
        return (
            <TableHead 
                onClick={() => handleSort(column)}
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
    };

    const reloadProduct = async () => {
        try {
            const updatedProduct = await productsService.getById(data.id);
            setProductData(updatedProduct);
        } catch (error) {
            toast({
                title: 'Error reloading product',
                description: 'Failed to refresh product data',
                variant: 'destructive',
            });
        }
    };

    const handleActivitySelect = async (activity: EcoinventActivity) => {
        if (selectedMaterial) {
            try {
                await materialsService.setActivity(selectedMaterial, activity);
                await reloadProduct();
                toast({
                    title: 'Activity set',
                    description: 'Activity set successfully',
                });
            } catch (error) {
                toast({
                    title: 'Error setting activity',
                    description: 'Error setting activity',
                    variant: 'destructive',
                });
                console.error('Error setting activity:', error);
            }
        }
        setIsModalOpen(false);
    };

    return (
        <>
            <Toaster />
            <Table>
                <TableHeader>
                    <TableRow>
                        <SortableHeader column="name" label="Name" />
                        <SortableHeader column="quantity" label="Quantity" />
                        <SortableHeader column="unit" label="Unit" />
                        <SortableHeader column="origin" label="Origin" />
                        <SortableHeader column="activityName" label="Activity Name" />
                        <SortableHeader column="referenceProduct" label="Reference Product" />
                        <TableHead>Completion</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {sortedMaterials.map((material, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-bold">{material.name}</TableCell>
                            <TableCell>{material.quantity}</TableCell>
                            <TableCell>{material.unit}</TableCell>
                            <TableCell>{material.origin}</TableCell>
                            <TableCell>{material.activityName}</TableCell>
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