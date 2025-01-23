import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { Button } from '../../../components/ui/button';
import { MaterialReviewList } from '../../../components/products/upload/MaterialReviewList';
import { UploadSummary } from '../../../components/products/upload/UploadSummary';
import { useUploadStore } from '../../../stores/uploadStore';
import { productsService } from '../../../services/products';
import { useToast } from '../../../hooks/use-toast';
import { Toaster } from '../../../components/ui/toaster';

export const Route = createFileRoute('/products/steps/preview')({
    component: PreviewRoute,
});

function PreviewRoute() {
    const navigate = useNavigate();
    const { uploadResponse, selectedMappings, setSelectedMappings, reset } = useUploadStore();
    const { toast } = useToast();

    if (!uploadResponse) {
        navigate({ to: '/products/steps/upload-file' });
        return null;
    }

    const handleConfirm = async () => {
        try {
            const payload = {
                mappings: selectedMappings,
            }
            console.log(payload);
            await productsService.confirmMaterialMappings(payload);
            reset();
            navigate({ to: '/products/list' });
        } catch (error) {
            console.error('Failed to confirm mappings:', error);
            toast({
                title: 'Error confirming mappings',
                description: error instanceof Error ? error.message : 'An error occurred while confirming mappings',
                variant: 'destructive',
            });
        }
    };

    const canConfirm = uploadResponse.materialsRequiringReview.length === 0 || 
                      Object.keys(selectedMappings).length > 0;

    return (
        <div className="space-y-8">
            <Toaster />
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Review Upload</h1>
                <Button variant="ghost" asChild>
                    <Link to="/products/steps/upload-file">← Back to Upload</Link>
                </Button>
            </div>

            <UploadSummary summary={uploadResponse.summary} />

            <MaterialReviewList
                materials={uploadResponse.materialsRequiringReview}
                selectedMappings={selectedMappings}
                onMappingChange={setSelectedMappings}
            />

            <div className="flex justify-end space-x-4">
                <Button
                    variant="outline"
                    onClick={() => {
                        reset();
                        navigate({ to: '/products/steps/upload-file' });
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleConfirm}
                    disabled={!canConfirm}
                >
                    {canConfirm ? 'Confirm and Import' : 'Select at least one material mapping'}
                </Button>
            </div>
        </div>
    );
} 