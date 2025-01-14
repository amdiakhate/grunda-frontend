import { Card } from "@/components/ui/card";
import { ProductSummary } from "@/interfaces/product";
import { ArrowDownIcon, ArrowUpIcon, ScaleIcon, Atom, PackageIcon } from "lucide-react";
import { useStore } from "../../useStore";
import { useEffect, useState } from "react";

interface SummaryProps {
    summary: ProductSummary;
}

export function Summary({ summary }: SummaryProps) {
    const { displayedImpact } = useStore();
    const [displayedImpactSummary, setDisplayedImpactSummary] = useState<{method: string, value: number, unit: string} | null>(null);

    useEffect(() => {
        if (displayedImpact) {
            const impact = summary.impacts.find((impact) => impact.method === displayedImpact.method);
            setDisplayedImpactSummary(impact || null);
        }
    }, [displayedImpact, summary.impacts]);

    const formatNumber = (num: number) => {
        return num < 1 ? num.toExponential(2) : num.toFixed(2);
    };

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Item ID</p>
                        <p className="text-2xl font-bold font-mono">{summary.itemId}</p>
                    </div>
                    <PackageIcon className="h-5 w-5 text-muted-foreground" />
                </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Weight</p>
                        <p className="text-2xl font-bold">{formatNumber(summary.weight)} kg</p>
                        <p className="flex items-center gap-1 text-sm">
                            {summary.weightDiff < 0 ? (
                                <ArrowDownIcon className="h-4 w-4 text-emerald-500" />
                            ) : (
                                <ArrowUpIcon className="h-4 w-4 text-rose-500" />
                            )}
                            <span className={`${summary.weightDiff < 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {summary.weightDiff > 0 ? '+' : ''}{summary.weightDiff}% vs catalog average
                            </span>
                        </p>
                    </div>
                    <ScaleIcon className="h-5 w-5 text-muted-foreground" />
                </div>
            </Card>

            {displayedImpactSummary && (
                <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground truncate max-w-[200px]">
                                {displayedImpactSummary.method}
                            </p>
                            <p className="text-2xl font-bold">{formatNumber(displayedImpactSummary.value)}</p>
                            <p className="text-sm text-muted-foreground">{displayedImpactSummary.unit}</p>
                        </div>
                        <Atom className="h-5 w-5 text-muted-foreground" />
                    </div>
                </Card>
            )}
        </div>
    );
} 