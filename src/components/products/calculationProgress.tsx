import { Progress } from "@/components/ui/progress";

interface CalculationProgressProps {
    progress: number;
    isVisible: boolean;
}

export function CalculationProgress({ progress, isVisible }: CalculationProgressProps) {
    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 right-4 w-80 bg-background rounded-lg shadow-lg p-4 animate-in slide-in-from-right">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Calculating impacts...</span>
                <span className="text-sm text-muted-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
                This might take several minutes. You can continue working.
            </p>
        </div>
    );
} 