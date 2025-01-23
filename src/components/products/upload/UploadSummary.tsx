import { UploadSummary as UploadSummaryType } from '../../../interfaces/csvUpload';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Progress } from '../../ui/progress';
import { Badge } from '../../ui/badge';
interface UploadSummaryProps {
    summary: UploadSummaryType;
}

export function UploadSummary({ summary }: UploadSummaryProps) {
    const matchPercentage = (summary.materialsMatched / summary.totalMaterials) * 100;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Upload Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-500">Total Products</p>
                        <p className="text-2xl font-bold">{summary.totalProducts}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Total Materials</p>
                        <p className="text-2xl font-bold">{summary.totalMaterials}</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Material Matching Progress</span>
                        <Badge variant={summary.status === 'ready' ? 'success' : 'warning'}>
                            {summary.statusMessage}
                        </Badge>
                    </div>
                    <Progress value={matchPercentage} className="h-2" />
                    <div className="flex justify-between text-sm">
                        <span>{summary.materialsMatched} matched</span>
                        <span>{summary.materialsUnmatched} need review</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 