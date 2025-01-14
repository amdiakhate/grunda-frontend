import { Copy, History, Trash2, Download, Clock, Share2, RefreshCw } from "lucide-react";
import { ActionToolbar } from "@/components/common/actionToolbar";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { productsService } from "@/services/products";
import { Material } from "@/interfaces/product";

interface ProductActionsProps {
    productId: string;
    onReloadComplete?: () => void;
    onCalculatingChange?: (calculating: boolean) => void;
    onDuplicate?: () => void;
    onHistory?: () => void;
    onDelete?: () => void;
    onExport?: () => void;
    onShare?: () => void;
    className?: string;
}

export function ProductActions({ productId, onReloadComplete, onCalculatingChange, ...props }: ProductActionsProps) {
    const [isReloading, setIsReloading] = useState(false);
    const { toast } = useToast();

    const handleReloadImpacts = async () => {
        setIsReloading(true);
        onCalculatingChange?.(true);
        try {
            await productsService.reloadProductImpacts(productId);
            toast({
                title: "Impact calculation started",
                description: "You can track the progress below",
            });
            
            // Polling avec mise à jour du statut
            const pollInterval = setInterval(async () => {
                const product = await productsService.getById(productId);
                const allComplete = product.materials.every((m: Material) => 
                    m.status === 'completed' || m.status === 'failed'
                );
                
                if (allComplete) {
                    clearInterval(pollInterval);
                    setIsReloading(false);
                    onReloadComplete?.();
                    
                    const hasFailures = product.materials.some((m: Material) => 
                        m.status === 'failed'
                    );
                    toast({
                        title: hasFailures ? "Calculation partially complete" : "Calculation complete",
                        description: hasFailures ? 
                            "Some materials failed to update" : 
                            "All materials have been updated",
                        variant: hasFailures ? "destructive" : "default"
                    });
                }
            }, 5000);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to reload impacts",
                variant: "destructive",
            });
            console.error(error);
            setIsReloading(false);
            onCalculatingChange?.(false);
        }
    };

    const actionGroups = [
        {
            actions: [
                {
                    icon: RefreshCw,
                    label: "Reload Impacts",
                    onClick: handleReloadImpacts,
                    variant: "ghost",
                    loading: isReloading,
                }
            ]
        },
        {
            actions: [
                {
                    icon: Copy,
                    label: "Duplicate",
                    onClick: props.onDuplicate
                },
                {
                    icon: History,
                    label: "History",
                    onClick: props.onHistory
                },
                {
                    icon: Trash2,
                    label: "Delete",
                    onClick: props.onDelete,
                    variant: "destructive"
                }
            ]
        },
        {
            actions: [
                {
                    icon: Download,
                    label: "Export",
                    onClick: props.onExport
                },
                {
                    icon: Clock,
                    label: "Recent"
                },
                {
                    icon: Share2,
                    label: "Share",
                    onClick: props.onShare
                }
            ]
        }
    ];

    const dropdownActions = [
        {
            label: "Compare with catalog",
            onClick: () => {}
        },
        {
            label: "Add to collection",
            onClick: () => {}
        },
        {
            label: "Generate report",
            onClick: () => {}
        }
    ];

    return (
        <ActionToolbar
            groups={actionGroups}
            dropdownActions={dropdownActions}
            className={props.className}
        />
    );
} 