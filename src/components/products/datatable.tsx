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
import {   useState } from 'react';
import { Button } from '@/components/ui/button';
import { ActivitySearchModal } from './activitySearchModal';
import { EcoinventActivity } from '@/interfaces/ecoinvent';
import { materialsService } from '../../services/materials';
import {   useToast } from '../../hooks/use-toast';
import { Toaster } from '../ui/toaster';
import { productsService } from '@/services/products';
import { SortableHeader } from '../ui/sortable-header';
import { sortItems } from '@/utils/sorting';
import { useStore } from '../../stores/useStore';

export function DataTable({ data }: { data: Product }) {
    const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productData, setProductData] = useState<Product>(data);
    const { toast } = useToast();
    const { displayedImpact } = useStore();
    const [sortConfig, setSortConfig] = useState<{key: string; direction: 'asc' | 'desc' | null}>({
        key: '',
        direction: null
    });

    const sortedMaterials = sortItems(productData.materials, sortConfig);


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
            console.error('Error reloading product:', error);
        }
    };

    const handleActivitySelect = async (activity: EcoinventActivity) => {
        if (selectedMaterial) {
            try {
                await materialsService.setActivity(productData, selectedMaterial, activity);
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
            <Table className="w-full">
                <TableHeader>
                    <TableRow>
                        <SortableHeader column="name" label="Name" sortConfig={sortConfig} onSort={handleSort} />
                        <SortableHeader column="quantity" label="Quantity" sortConfig={sortConfig} onSort={handleSort} />
                        <SortableHeader column="unit" label="Unit" sortConfig={sortConfig} onSort={handleSort} />
                        <SortableHeader column="activityUnit" label="Activity Unit" sortConfig={sortConfig} onSort={handleSort} />
                        <TableHead>Footprint ({displayedImpact?.unit || ''})</TableHead>
                        <TableHead>Share</TableHead>
                        <SortableHeader column="material_origin" label="Material Origin" sortConfig={sortConfig} onSort={handleSort} />
                        <SortableHeader column="production_origin" label="Production Origin" sortConfig={sortConfig} onSort={handleSort} />
                        <SortableHeader column="activityName" label="Activity Name" sortConfig={sortConfig} onSort={handleSort} />
                        <SortableHeader column="referenceProduct" label="Reference Product" sortConfig={sortConfig} onSort={handleSort} />
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
                            <TableCell>{material.activityUnit}</TableCell>
                            <TableCell>
                                {displayedImpact ? 
                                    material.impactResults.find((impact) => impact.method === displayedImpact.method)?.value
                                    : ''}
                            </TableCell>
                            <TableCell>{material.impactResults.find((impact) => impact.method === displayedImpact?.method)?.share}</TableCell>
                            <TableCell>{material.material_origin}</TableCell>
                            <TableCell>{material.production_origin}</TableCell>
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
                    product={productData}
                    material={selectedMaterial}
                />
            )}
        </>
    )

}