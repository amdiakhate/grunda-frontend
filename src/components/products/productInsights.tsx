import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductSummary } from "@/interfaces/product";
import { ArrowDownIcon, ArrowUpIcon, ScaleIcon, Atom } from "lucide-react";
import { useStore } from "../../stores/useStore";
import { useEffect, useState } from "react";

interface ProductInsightsProps {
    summary: ProductSummary;
}

export function ProductInsights({ summary }: ProductInsightsProps) {


    const { displayedImpact } = useStore();
    const [displayedImpactSummary, setDisplayedImpactSummary] = useState<{method : string, value: number, unit: string} | null>(null);

    useEffect(() => {
        if (displayedImpact) {
            const impact = summary.impacts.find((impact) => impact.method === displayedImpact.method);
            setDisplayedImpactSummary(impact || null);
        }
    }, [displayedImpact, summary.impacts]);

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Item ID</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{summary.itemId}</div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Weight</CardTitle>
                    <ScaleIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{summary.weight} kg</div>
                    <div className="flex items-center pt-1">
                        {summary.weightDiff < 0 ? (
                            <ArrowDownIcon className="h-4 w-4 text-green-500" />
                        ) : (
                            <ArrowUpIcon className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`text-xs ${summary.weightDiff < 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {Math.abs(summary.weightDiff)}% vs catalog average
                        </span>
                    </div>
                </CardContent>
            </Card>

            {displayedImpactSummary && (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{displayedImpactSummary.method}</CardTitle>
                        <Atom className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-1xl font-bold">
                            {displayedImpactSummary.value} {displayedImpactSummary.unit}
                        </div>
                    </CardContent>
                </Card>
            )}


        </div>
    );
} 