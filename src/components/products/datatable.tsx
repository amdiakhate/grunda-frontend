import {
    Table,
    TableRow,
    TableHead,
    TableHeader,
    TableBody,
    TableCell,
  } from '../../components/ui/table'
import { Material, Product } from '../../interfaces/product';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { EcoinventActivity } from '@/interfaces/ecoinvent';
import { materialsService } from '../../services/materials';
import {   useToast } from '../../hooks/use-toast';
import { Toaster } from '../ui/toaster';
import { productsService } from '@/services/products';
import { SortableHeader } from '../ui/sortable-header';
import { sortItems } from '@/utils/sorting';
import { useStore } from '../../stores/useStore';
import { Search, CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';
import { AlternativeSuggestionsModal } from './upload/AlternativeSuggestionsModal';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

export interface DataTableProps {
    data: Product;
    onUpdate?: () => Promise<void>;
}

export function DataTable({ data, onUpdate }: DataTableProps) {
    const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productData, setProductData] = useState<Product>(data);
    const [alternatives, setAlternatives] = useState<EcoinventActivity[] | null>(null);
    const [isLoadingAlternatives, setIsLoadingAlternatives] = useState(false);
    const [isSettingActivity, setIsSettingActivity] = useState(false);
    const [isReloadingProduct, setIsReloadingProduct] = useState(false);
    const { toast } = useToast();
    const { displayedImpact } = useStore();
    const [sortConfig, setSortConfig] = useState<{key: string; direction: 'asc' | 'desc' | null}>({
        key: '',
        direction: null
    });
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

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
        setIsReloadingProduct(true);
        try {
            const updatedProduct = await productsService.getById(data.id);
            setTimeout(() => {
                setProductData(updatedProduct);
                setIsReloadingProduct(false);
            }, 300);
        } catch (error) {
            toast({
                title: 'Error reloading product',
                description: 'Failed to refresh product data',
                variant: 'destructive',
            });
            console.error('Error reloading product:', error);
            setIsReloadingProduct(false);
        }
    };

    const handleSearchAlternatives = async (material: Material) => {
        if (material.completion) {
            setSelectedMaterial(material);
            setIsConfirmDialogOpen(true);
            return;
        }
        await searchAlternatives(material);
    };

    const searchAlternatives = async (material: Material) => {
        setIsLoadingAlternatives(true);
        try {
            const alternatives = await productsService.getAlternativeSuggestions(material.name);
            if (!alternatives || alternatives.length === 0) {
                toast({
                    title: 'No alternatives found',
                    description: 'No alternative materials were found in the database. Try adjusting the material name or contact support.',
                    variant: 'default',
                });
                return;
            }
            setAlternatives(alternatives);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error getting alternative suggestions:', error);
            toast({
                title: 'Error getting alternatives',
                description: error instanceof Error ? error.message : 'An error occurred while getting alternative suggestions',
                variant: 'destructive',
            });
            setAlternatives(null);
        } finally {
            setIsLoadingAlternatives(false);
        }
    };

    const handleActivitySelect = async (activity: EcoinventActivity) => {
        if (!selectedMaterial || !productData) return;
        
        setIsSettingActivity(true);
        setIsModalOpen(false);

        try {
            toast({
                title: 'Updating material mapping',
                description: 'Please wait while we update the material...',
            });

            await materialsService.setActivity(productData, selectedMaterial, activity);
            
            toast({
                title: 'Activity set successfully',
                description: 'Refreshing product data...',
            });

            if (onUpdate) {
                await onUpdate();
            } else {
                await reloadProduct();
            }
            
            toast({
                title: 'Update complete',
                description: 'Material mapping has been updated successfully',
            });
        } catch (error) {
            toast({
                title: 'Error setting activity',
                description: error instanceof Error ? error.message : 'An error occurred while setting the activity',
                variant: 'destructive',
            });
            console.error('Error setting activity:', error);
        } finally {
            setIsSettingActivity(false);
            setSelectedMaterial(null);
        }
    };

    const getCompletionStatus = (material: Material) => {
        if (material.completion) {
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <Badge variant="success" className="flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                Mapped
                            </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Material is mapped to Ecoinvent activity</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
        }
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <Badge variant="destructive" className="flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Not Mapped
                        </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Material needs to be mapped to an Ecoinvent activity</p>
                    </TooltipContent>
                </Tooltip>
                </TooltipProvider>
        );
    };

    const formatValue = (value: number | undefined) => {
        if (value === undefined) return '-';
        return value.toFixed(2);
    };

    const formatQuantity = (quantity: number | undefined) => {
        if (quantity === undefined) return '-';
        return quantity.toFixed(2);
    };

    const getActivityInfo = (material: Material) => {
        if (!material.activityName) return null;
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger className="text-left">
                        <div className="flex flex-col">
                            <span className="font-medium truncate max-w-[200px]">{material.activityName}</span>
                            <span className="text-xs text-muted-foreground">{material.referenceProduct}</span>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent className="w-[300px]">
                        <div className="space-y-2">
                            <div>
                                <span className="font-medium">Activity Name:</span> {material.activityName}
                            </div>
                            <div>
                                <span className="font-medium">Reference Product:</span> {material.referenceProduct}
                            </div>
                            <div>
                                <span className="font-medium">Origin:</span> {material.activityOrigin}
                            </div>
                            <div>
                                <span className="font-medium">Unit:</span> {material.activityUnit}
                            </div>
                        </div>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    };

    const getOriginInfo = (material: Material) => {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger className="text-left">
                        <div className="flex flex-col">
                            <span className="font-medium">{material.material_origin}</span>
                            <span className="text-xs text-muted-foreground">{material.production_origin}</span>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <div className="space-y-1">
                            <div>
                                <span className="font-medium">Material Origin:</span> {material.material_origin}
                            </div>
                            <div>
                                <span className="font-medium">Production Origin:</span> {material.production_origin}
                            </div>
                        </div>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    };

    return (
        <>
            <Toaster />
            <div className={`transition-opacity duration-300 ${isReloadingProduct ? 'opacity-50' : 'opacity-100'}`}>
                <Table className="w-full">
                    <TableHeader>
                        <TableRow>
                            <SortableHeader column="name" label="Material" sortConfig={sortConfig} onSort={handleSort} />
                            <TableHead className="w-[150px]">Quantity</TableHead>
                            <TableHead className="w-[200px]">Origin</TableHead>
                            <TableHead className="w-[250px]">Activity</TableHead>
                            <TableHead className="w-[150px]">Impact ({displayedImpact?.unit || ''})</TableHead>
                            <TableHead className="w-[100px]">Status</TableHead>
                            <TableHead className="w-[150px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {sortedMaterials.map((material, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-bold">{material.name}</TableCell>
                                <TableCell>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger className="text-left">
                                                <div className="flex flex-col">
                                                    <span>{formatQuantity(material.quantity)} {material.unit}</span>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <div className="space-y-1">
                                                    <div>
                                                        <span className="font-medium">Quantity:</span> {formatQuantity(material.quantity)} {material.unit}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Activity Unit:</span> {material.activityUnit}
                                                    </div>
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </TableCell>
                                <TableCell>{getOriginInfo(material)}</TableCell>
                                <TableCell>{getActivityInfo(material)}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span>{displayedImpact ? formatValue(material.impactResults.find((impact) => impact.method === displayedImpact.method)?.value) : '-'}</span>
                                        {displayedImpact && material.impactResults.find(impact => impact.method === displayedImpact.method)?.share && (
                                            <span className="text-xs text-muted-foreground">
                                                {formatValue(material.impactResults.find(impact => impact.method === displayedImpact.method)?.share)}% of total impact
                                            </span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>{getCompletionStatus(material)}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleSearchAlternatives(material)}
                                        className="flex items-center gap-2"
                                    >
                                        <Search className="h-4 w-4" />
                                        Find Alternatives
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-warning">
                            <AlertTriangle className="h-5 w-5" />
                            Warning: Material Already Mapped
                        </DialogTitle>
                    </DialogHeader>
                    <DialogDescription className="space-y-4">
                        <p>
                            This material is already mapped to an activity. Changing the mapping will:
                        </p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Reset the current mapping</li>
                            <li>Require recalculation of environmental impacts</li>
                            <li>Update all related metrics</li>
                        </ul>
                        <p className="font-medium">
                            Are you sure you want to proceed?
                        </p>
                    </DialogDescription>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsConfirmDialogOpen(false);
                                setSelectedMaterial(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                setIsConfirmDialogOpen(false);
                                if (selectedMaterial) {
                                    searchAlternatives(selectedMaterial);
                                }
                            }}
                        >
                            Proceed Anyway
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {selectedMaterial && (
                <AlternativeSuggestionsModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        if (!isSettingActivity) {
                            setIsModalOpen(false);
                            setSelectedMaterial(null);
                        }
                    }}
                    onSelect={handleActivitySelect}
                    materialName={selectedMaterial.name}
                    alternatives={alternatives}
                    isLoading={isLoadingAlternatives}
                    isSettingActivity={isSettingActivity}
                />
            )}
        </>
    );
}