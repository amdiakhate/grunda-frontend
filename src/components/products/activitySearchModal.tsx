import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { materialsService } from '@/services/materials';
import { EcoinventActivity } from '@/interfaces/ecoinvent';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Material } from '../../interfaces/product';
import { ScrollArea } from "@/components/ui/scroll-area";

interface ActivitySearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (activity: EcoinventActivity) => void;
    material: Material;
}

export function ActivitySearchModal({ isOpen, onClose, onSelect, material }: ActivitySearchModalProps) {
    const [activities, setActivities] = useState<EcoinventActivity[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

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

    // Pagination
    const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
    const paginatedActivities = filteredActivities.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSearch = async () => {
        setIsLoading(true);
        try {
            const results = await materialsService.searchEcoinventActivities(material);
            setActivities(results);
            setCurrentPage(1); // Reset to first page when new results arrive
        } catch (error) {
            console.error('Error searching activities:', error);
        } finally {
            setIsLoading(false);
        }
    };

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
                                        <TableHead className="w-[300px]">Name</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead className="w-[200px]">Reference Product</TableHead>
                                        <TableHead>Unit</TableHead>
                                        <TableHead className="w-[100px]">Select</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedActivities.map((activity, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{activity.name}</TableCell>
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