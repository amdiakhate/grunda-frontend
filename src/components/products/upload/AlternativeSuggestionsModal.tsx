import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EcoinventActivity } from "@/interfaces/ecoinvent";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

interface AlternativeSuggestionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (activity: EcoinventActivity) => void;
    materialName: string;
    alternatives: EcoinventActivity[] | null;
    isLoading: boolean;
}

export function AlternativeSuggestionsModal({
    isOpen,
    onClose,
    onSelect,
    materialName,
    alternatives,
    isLoading,
}: AlternativeSuggestionsModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Alternative Suggestions for "{materialName}"</DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-hidden">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full space-y-4">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-lg text-gray-600">Loading suggestions...</p>
                        </div>
                    ) : alternatives && alternatives.length > 0 ? (
                        <ScrollArea className="h-full">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Reference Product</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Confidence</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {alternatives.map((activity) => (
                                        <TableRow key={activity.id}>
                                            <TableCell className="font-medium">{activity.name}</TableCell>
                                            <TableCell>{activity.referenceProduct}</TableCell>
                                            <TableCell>{activity.location}</TableCell>
                                            <TableCell>
                                                <Badge variant={activity.confidence >= 0.7 ? 'success' : activity.confidence >= 0.4 ? 'warning' : 'destructive'}>
                                                    {Math.round(activity.confidence * 100)}%
                                                </Badge>
                                            </TableCell>
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
                        </ScrollArea>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full space-y-2">
                            <p className="text-lg text-gray-600">No alternative suggestions found</p>
                            <p className="text-sm text-gray-500">Try contacting support</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
} 