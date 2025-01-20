// Import necessary UI components
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LucideIcon, MoreVertical } from "lucide-react";

// Interface for individual action items
interface Action {
    icon?: LucideIcon;
    label: string;
    onClick?: () => void;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    loading?: boolean;
    disabled?: boolean;
}

// Interface for grouping actions
interface ActionGroup {
    actions: Action[];
}

// Interface for dropdown menu actions
interface DropdownAction {
    label: string;
    onClick?: () => void;
}

// Main component props interface
interface ActionToolbarProps {
    groups: ActionGroup[];
    dropdownActions?: DropdownAction[];
    className?: string;
}

// ActionToolbar component - Renders a toolbar with grouped actions and optional dropdown
export function ActionToolbar({
    groups,
    dropdownActions,
    className
}: ActionToolbarProps) {
    return (
        // Main container with styling
        <div className={`flex items-center gap-2 bg-background border rounded-lg p-1 ${className}`}>
            {/* Map through action groups */}
            {groups.map((group, groupIndex) => (
                <>
                    {/* Add separator between groups */}
                    {groupIndex > 0 && (
                        <Separator orientation="vertical" className="h-8" />
                    )}
                    {/* Group container */}
                    <div key={groupIndex} className="flex items-center gap-1">
                        {/* Map through individual actions in the group */}
                        {group.actions.map((action, actionIndex) => {
                            const Icon = action.icon;
                            return (
                                // Render action button
                                <Button
                                    key={actionIndex}
                                    variant={action.variant || "ghost"}
                                    size="icon"
                                    onClick={action.onClick}
                                    title={action.label}
                                    disabled={action.loading}
                                >
                                    <Icon className={`h-4 w-4 ${action.loading ? 'animate-spin' : ''}`} />
                                </Button>
                            );
                        })}
                    </div>
                </>
            ))}

            {/* Render dropdown menu if actions are provided */}
            {dropdownActions && dropdownActions.length > 0 && (
                <>
                    <Separator orientation="vertical" className="h-8" />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {/* Map through dropdown actions */}
                            {dropdownActions.map((action, index) => (
                                <DropdownMenuItem
                                    key={index}
                                    onClick={action.onClick}
                                >
                                    {action.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            )}
        </div>
    );
} 