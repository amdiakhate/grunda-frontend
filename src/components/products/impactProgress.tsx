import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Material } from "@/interfaces/product";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

interface ImpactProgressProps {
    materials: Material[];
    isVisible: boolean;
}

export function ImpactProgress({ materials, isVisible }: ImpactProgressProps) {
    if (!isVisible) return null;

    const completedCount = materials.filter(m => m.status === 'completed').length;
    const progress = (completedCount / materials.length) * 100;

    return (
        <Card className="mb-4">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                    <span>Calculating Impacts</span>
                    <span className="text-sm font-normal text-muted-foreground">
                        {completedCount} / {materials.length} materials
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Progress value={progress} className="h-2" />
                
                <div className="grid gap-2">
                    {materials.map((material, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2">
                                {material.status === 'completed' ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                ) : material.status === 'failed' ? (
                                    <XCircle className="h-4 w-4 text-destructive" />
                                ) : (
                                    <Clock className="h-4 w-4 text-muted-foreground animate-pulse" />
                                )}
                                {material.name}
                            </span>
                            <span className="text-muted-foreground">
                                {material.status === 'completed' ? 'Done' : 
                                 material.status === 'failed' ? 'Failed' : 'Processing...'}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
} 