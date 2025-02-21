import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { adminService } from '@/services/admin';
import type { MaterialDetails } from '@/interfaces/material';
import type { MaterialMapping } from '@/interfaces/materialMapping';
import { useMaterialMappings } from '@/hooks/useMaterialMappings';
import { Loader2 } from 'lucide-react';
import { MaterialMappingList } from '@/components/materials/MaterialMappingList';
import { useToast } from '@/components/ui/use-toast';

export const Route = createFileRoute('/admin/materials/$id')({
  component: MaterialDetailsPage,
});

function MaterialDetailsPage() {
  const { id } = Route.useParams();
  const { toast } = useToast();
  const [material, setMaterial] = useState<MaterialDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string>();
  const { 
    mappings, 
    loading: mappingsLoading, 
    setSearchQuery,
    currentPage,
    totalPages,
    setCurrentPage,
    refetch 
  } = useMaterialMappings();

  const fetchMaterial = async () => {
    try {
      setLoading(true);
      const data = await adminService.getMaterialById(id);
      setMaterial(data);
    } catch (error) {
      console.error('Failed to fetch material details:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load material details. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterial();
  }, [id, toast]);

  const handleMappingSelect = async (mapping: MaterialMapping) => {
    try {
      setProcessingId(mapping.id);
      
      // Si c'est une suppression (mapping vide)
      if (!mapping.id) {
        await adminService.removeMaterialMapping(id);
        setMaterial(prev => prev ? {
          ...prev,
          activityUuid: undefined,
          activityName: undefined,
          activityUnit: undefined,
          activityOrigin: undefined,
          transformationActivityUuid: undefined,
          transformationActivityName: undefined,
          transformationActivityUnit: undefined,
          transformationActivityOrigin: undefined,
          referenceProduct: undefined,
          transformationReferenceProduct: undefined,
        } : null);
        
        toast({
          title: "Success",
          description: "Activity mapping removed successfully",
        });
      } else {
        const result = await adminService.matchMaterial(id, mapping.id);
        
        if (result.success) {
          setMaterial(prev => prev ? {
            ...prev,
            ...result.material,
            activityUuid: result.activity.uuid,
            activityName: result.activity.name,
            activityUnit: result.activity.unit,
            activityOrigin: result.activity.location,
            referenceProduct: result.activity.referenceProduct,
            transformationActivityUuid: result.transformation?.uuid,
            transformationActivityName: result.transformation?.name,
            transformationActivityUnit: result.transformation?.unit,
            transformationActivityOrigin: result.transformation?.location,
            transformationReferenceProduct: result.transformation?.referenceProduct,
          } : null);
          
          toast({
            title: "Success",
            description: result.message,
          });
        }
      }

      // Refresh the mappings list to update counts
      await refetch();
    } catch (error) {
      console.error('Failed to match material:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to match material. Please try again.";
      
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setProcessingId(undefined);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-gray-500">Loading material details...</p>
      </div>
    );
  }

  if (!material) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-lg font-medium">Material not found</p>
        <Button variant="outline" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{material.name}</h1>
        <p className="text-gray-500">{material.description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Material Information</CardTitle>
          <CardDescription>Basic details about the material</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <dt className="text-sm font-medium text-gray-500">Quantity</dt>
              <dd className="mt-1 text-lg">{material.quantity} {material.unit}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1">
                <Badge variant="outline" className="text-base">
                  {material.product_review_status}
                </Badge>
              </dd>
            </div>
            {material.assembling_location && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Assembling Location</dt>
                <dd className="mt-1">{material.assembling_location}</dd>
              </div>
            )}
            {material.material_origin && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Material Origin</dt>
                <dd className="mt-1">{material.material_origin}</dd>
              </div>
            )}
            {material.activityUuid && (
              <div className="col-span-full">
                <dt className="text-sm font-medium text-gray-500 mb-2">Current Activity</dt>
                <dd className="mt-1 bg-muted/50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">Activity ID</Badge>
                    <span className="font-mono text-sm">{material.activityUuid}</span>
                  </div>
                  {material.activityName && (
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">Name</Badge>
                      <span>{material.activityName}</span>
                    </div>
                  )}
                  {material.activityUnit && (
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">Unit</Badge>
                      <span>{material.activityUnit}</span>
                    </div>
                  )}
                  {material.activityOrigin && (
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">Location</Badge>
                      <span>{material.activityOrigin}</span>
                    </div>
                  )}
                  {material.referenceProduct && (
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">Reference Product</Badge>
                      <span>{material.referenceProduct}</span>
                    </div>
                  )}
                  {material.transformationActivityName && (
                    <>
                      <div className="h-px bg-border my-2" />
                      <div className="font-medium text-sm text-muted-foreground mb-2">Transformation</div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">Activity ID</Badge>
                        <span className="font-mono text-sm">{material.transformationActivityUuid}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">Name</Badge>
                        <span>{material.transformationActivityName}</span>
                      </div>
                      {material.transformationActivityUnit && (
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">Unit</Badge>
                          <span>{material.transformationActivityUnit}</span>
                        </div>
                      )}
                      {material.transformationActivityOrigin && (
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">Location</Badge>
                          <span>{material.transformationActivityOrigin}</span>
                        </div>
                      )}
                      {material.transformationReferenceProduct && (
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">Reference Product</Badge>
                          <span>{material.transformationReferenceProduct}</span>
                        </div>
                      )}
                    </>
                  )}
                </dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>
                {material.activityUuid ? 'Change Activity Mapping' : 'Add Activity Mapping'}
              </CardTitle>
              <CardDescription>
                {material.activityUuid 
                  ? 'Change or remove the current activity mapping for this material'
                  : 'Select an activity mapping for this material'}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {material.activityUuid && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleMappingSelect({ id: '', activityUuid: '', activityName: '', materialPattern: '', materialsCount: 0, finalProduct: false })}
                >
                  Remove Mapping
                </Button>
              )}
              <Button variant="outline" size="sm">
                Create New Mapping
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {processingId && (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full space-y-4">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="font-semibold text-lg">Updating Material Activity</h3>
                  <p className="text-muted-foreground">
                    {processingId === '' 
                      ? 'Removing current activity mapping...'
                      : 'Updating activity mapping and refreshing material information...'}
                  </p>
                </div>
              </div>
            </div>
          )}
          <MaterialMappingList
            mappings={mappings}
            loading={mappingsLoading}
            onSelect={handleMappingSelect}
            onSearch={setSearchQuery}
            selectedId={material.activityUuid}
            processingId={processingId}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            currentMapping={material.activityUuid ? mappings.find(m => m.activityUuid === material.activityUuid) || {
              id: material.activityUuid,
              activityUuid: material.activityUuid,
              activityName: material.activityName || '',
              materialPattern: material.name,
              materialsCount: 0,
              finalProduct: false,
              unit: material.activityUnit,
              origin: material.activityOrigin,
              transform: material.transformationActivityName,
            } : null}
          />
        </CardContent>
      </Card>
    </div>
  );
} 