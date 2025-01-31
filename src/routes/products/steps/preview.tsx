import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { Button } from '../../../components/ui/button';
import { MaterialReviewList } from '../../../components/products/upload/MaterialReviewList';
import { UploadSummary } from '../../../components/products/upload/UploadSummary';
import { useUploadStore } from '../../../stores/uploadStore';
import { productsService } from '../../../services/products';
import { useToast } from '../../../hooks/use-toast';
import { Toaster } from '../../../components/ui/toaster';
import { useEffect } from 'react';
import { MaterialRequiringReview } from '../../../interfaces/csvUpload';
import { Progress } from '../../../components/ui/progress';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../../../components/ui/alert';

export const Route = createFileRoute('/products/steps/preview')({
    component: PreviewRoute,
});

function PreviewRoute() {
    const navigate = useNavigate();
    const { uploadResponse, selectedMappings, setSelectedMappings, reset, updateMaterial } = useUploadStore();
    const { toast } = useToast();

    // Handle navigation when uploadResponse is null or when all materials are mapped
    useEffect(() => {
        if (!uploadResponse) {
            navigate({ to: '/products/steps/upload-file' });
            return;
        }

        if (uploadResponse.materialsRequiringReview.length === 0) {
            toast({
                title: 'Upload successful',
                description: 'All materials were automatically mapped',
            });
            reset();
            navigate({ to: '/products/list' });
        }
    }, [uploadResponse, navigate, reset, toast]);

    // If we're navigating away, don't render anything
    if (!uploadResponse || uploadResponse.materialsRequiringReview.length === 0) {
        return null;
    }

    const handleConfirm = async () => {
        try {
            await productsService.confirmMaterialMappings({
                mappings: selectedMappings
            });
            toast({
                title: 'Mappings confirmed',
                description: 'Your materials have been successfully mapped',
            });
            reset();
            await navigate({ to: '/products/list' });
        } catch (error) {
            console.error('Failed to confirm mappings:', error);
            toast({
                title: 'Error confirming mappings',
                description: error instanceof Error ? error.message : 'An error occurred while confirming mappings',
                variant: 'destructive',
            });
        }
    };

    const handleMaterialUpdate = (updatedMaterial: MaterialRequiringReview) => {
        updateMaterial(updatedMaterial);
    };

    // Calculate mapping progress
    const totalMaterials = uploadResponse.materialsRequiringReview.length;
    const mappedMaterials = Object.keys(selectedMappings).length;
    const mappingProgress = (mappedMaterials / totalMaterials) * 100;

    // Check for unmapped materials with no suggestions
    const materialsWithoutSuggestions = uploadResponse.materialsRequiringReview.filter(
        material => !selectedMappings[material.id] && material.suggestions.length === 0
    );

    // Remove the requirement that all materials must be mapped
    const canConfirm = Object.keys(selectedMappings).length > 0;

    return (
        <div className="space-y-8">
            <Toaster />
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Review Upload</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {mappedMaterials} of {totalMaterials} materials mapped ({Math.round(mappingProgress)}%)
                    </p>
                </div>
                <Button variant="ghost" asChild>
                    <Link to="/products/steps/upload-file">← Back to Upload</Link>
                </Button>
            </div>

            <Progress value={mappingProgress} className="h-2" />

            {uploadResponse.summary.materialsMatched > 0 && (
                <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertTitle className="text-green-700">Automatic Mapping Success</AlertTitle>
                    <AlertDescription className="text-green-600">
                        {uploadResponse.summary.materialsMatched} material{uploadResponse.summary.materialsMatched > 1 ? 's were' : ' was'} automatically matched ({Math.round((uploadResponse.summary.materialsMatched / uploadResponse.summary.totalMaterials) * 100)}% of total)
                    </AlertDescription>
                </Alert>
            )}

            {uploadResponse.summary.materialsUnmatched > 0 && (
                <Alert className="bg-blue-50 border-blue-200">
                    <AlertCircle className="h-4 w-4 text-blue-500" />
                    <AlertTitle className="text-blue-700">Manual Mapping Required</AlertTitle>
                    <AlertDescription className="text-blue-600">
                        {uploadResponse.summary.materialsUnmatched} material{uploadResponse.summary.materialsUnmatched > 1 ? 's need' : ' needs'} to be mapped manually ({Math.round((uploadResponse.summary.materialsUnmatched / uploadResponse.summary.totalMaterials) * 100)}% of total)
                    </AlertDescription>
                </Alert>
            )}

            {materialsWithoutSuggestions.length > 0 && (
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Materials without suggestions</AlertTitle>
                    <AlertDescription>
                        {materialsWithoutSuggestions.length} material{materialsWithoutSuggestions.length > 1 ? 's' : ''} have no suggestions.
                        Use the search icon to find alternative mappings.
                        If you are unable to find a mapping in the Ecoinvent database, please contact support.
                    </AlertDescription>
                </Alert>
            )}

            <UploadSummary summary={uploadResponse.summary} />

            <MaterialReviewList
                materials={uploadResponse.materialsRequiringReview}
                selectedMappings={selectedMappings}
                onMappingChange={setSelectedMappings}
                onMaterialUpdate={handleMaterialUpdate}
            />

            <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                    {totalMaterials - mappedMaterials} material{totalMaterials - mappedMaterials !== 1 ? 's' : ''} still need{totalMaterials - mappedMaterials === 1 ? 's' : ''} mapping
                </div>
                <div className="flex space-x-4">
                    <Button
                        variant="outline"
                        onClick={async () => {
                            reset();
                            await navigate({ to: '/products/steps/upload-file' });
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={!canConfirm}
                    >
                        {canConfirm 
                            ? mappedMaterials === totalMaterials 
                                ? 'Confirm All Mappings' 
                                : `Confirm ${mappedMaterials} Mapping${mappedMaterials > 1 ? 's' : ''}`
                            : 'Select at least one material mapping'
                        }
                    </Button>
                </div>
            </div>
        </div>
    );
} 