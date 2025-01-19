import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { materialsService } from '@/services/materials';
import { EcoinventActivity } from '@/interfaces/ecoinvent';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Material, Product } from '../../interfaces/product';
import { ScrollArea } from "@/components/ui/scroll-area";
import { SortableHeader, type SortConfig } from '@/components/ui/sortable-header';
import { sortItems } from '@/utils/sorting';
interface ActivitySearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (activity: EcoinventActivity) => void;
    product: Product;
    material: Material;
}

export function ActivitySearchModal({ isOpen, onClose, onSelect, product, material }: ActivitySearchModalProps) {
    const [activities, setActivities] = useState<EcoinventActivity[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        key: '',
        direction: null
    });

    // Reset activities when modal closes
    useEffect(() => {
        if (!isOpen) {
            setActivities([]);
            setSearchTerm('');
            setCurrentPage(1);
        }
    }, [isOpen]);

    //Filter activities based on search term
    const filteredActivities = activities.filter(activity => 
        activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.referenceProduct.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedActivities = sortItems(filteredActivities, sortConfig);
    const paginatedActivities = sortedActivities.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSearch = async () => {
        setIsLoading(true);
        try {
            const results = await materialsService.searchEcoinventActivities(product, material);
            setActivities(results);
            setCurrentPage(1); // Reset to first page when new results arrive
        } catch (error) {
            console.error('Error searching activities:', error);
        } finally {
            setIsLoading(false);
        }
    };

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

    // Calculer totalPages
    const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Search Ecoinvent Activity for {material.name}</DialogTitle>
                    <DialogDescription>
                        {activities.length} activities found. Use the search box to filter results.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="flex flex-col gap-4 flex-1 overflow-hidden">
                    <div className="flex gap-2">
                        <Button onClick={handleSearch} disabled={isLoading}>
                            {isLoading ? 'Searching...' : 'Fetch Activities'}
                        </Button>
                        <Input
                            placeholder="Filter activities..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="flex-1"
                        />
                    </div>

                    <ScrollArea className="flex-1 border rounded-md">
                        {activities.length > 0 && (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <SortableHeader 
                                            column="name" 
                                            label="Name" 
                                            sortConfig={sortConfig} 
                                            onSort={handleSort}
                                        />
                                        <SortableHeader 
                                            column="location" 
                                            label="Location" 
                                            sortConfig={sortConfig} 
                                            onSort={handleSort}
                                        />
                                        <SortableHeader 
                                            column="referenceProduct" 
                                            label="Reference Product" 
                                            sortConfig={sortConfig} 
                                            onSort={handleSort}
                                        />
                                        <SortableHeader 
                                            column="unit" 
                                            label="Unit" 
                                            sortConfig={sortConfig} 
                                            onSort={handleSort}
                                        />
                                        <TableHead className="w-[100px]">Select</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedActivities.map((activity: EcoinventActivity, index: number) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">
                                                {activity.uuid === material.activityUuid ? (
                                                    <div className="flex items-center gap-2">
                                                       <span>✓</span>

                                                        {activity.name}
                                                    </div>
                                                ) : activity.name}
                                            </TableCell>
                                            <TableCell>{activity.location}</TableCell>
                                            <TableCell>{activity.referenceProduct}</TableCell>
                                            <TableCell>{activity.unit}</TableCell>
                                            <TableCell>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    onClick={() => onSelect(activity)}
                                                >
                                                    Select
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </ScrollArea>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-center space-x-2 py-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </Button>
                            <span className="text-sm">
                                Page {currentPage} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
} 