import { Copy, History, Trash2, Download, Clock, Share2, RefreshCw } from "lucide-react";
import { ActionToolbar } from "@/components/common/actionToolbar";
import { useState } from "react";


interface ProductActionsProps {
    // productId: string;
    calculationLoading: boolean;
    onStartCalculation?: () => void;
    onDuplicate?: () => void;
    onHistory?: () => void;
    onDelete?: () => void;
    onExport?: () => void;
    onShare?: () => void;
    className?: string;
}

export function ProductActions({  onStartCalculation, calculationLoading,  ...props }: ProductActionsProps) {

    const [isCalculating] = useState(calculationLoading);


    const actionGroups = [
        {
            actions: [
                {
                    icon: RefreshCw,
                    label: "Reload Impacts",
                    onClick: onStartCalculation,
                    variant: "ghost",
                    loading: isCalculating,
                    disabled: isCalculating
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