import { useState, useEffect } from 'react';
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import { adminService } from '@/services/admin';
import { MaterialMappingList } from '@/components/materials/MaterialMappingList';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { MaterialMapping } from '@/interfaces/materialMapping';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMaterialMappings } from '@/hooks/useMaterialMappings';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { MaterialMappingForm } from '@/components/materials/MaterialMappingForm';
import { materialMappingsService } from '@/services/materialMappings';
import type { CreateMaterialMappingDto, UpdateMaterialMappingDto } from '@/interfaces/materialMapping';

export const Route = createFileRoute('/admin/materials/$id')({
  component: MaterialDetailsPage,
});

interface RawMaterial {
  id: string;
  name: string;
  description?: string;
  product_affected: number;
  isMapped: boolean;
  mappingId?: string | null;
  mappingInfo?: {
    materialPattern: string;
    activityName: string;
    finalProduct: boolean;
  } | null;
  createdAt: string;
  updatedAt: string;
  recentProducts?: Array<{
    id: string;
    name: string;
    reference: string;
    category: string;
    updatedAt: string;
    quantity: number;
    unit: string;
  }>;
}

function MaterialDetailsPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [material, setMaterial] = useState<RawMaterial | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isMappingLoading, setIsMappingLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const {
    mappings,
    loading: mappingsLoading,
    searchQuery,
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    setSearchQuery,
    setCurrentPage,
    refresh,
  } = useMaterialMappings();
  const [confirmMappingDialogOpen, setConfirmMappingDialogOpen] = useState(false);
  const [pendingMapping, setPendingMapping] = useState<MaterialMapping | null>(null);

  useEffect(() => {
    if (id) {
      fetchMaterial();
    }
  }, [id]);

  const fetchMaterial = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const data = await adminService.getRawMaterialById(id);
      setMaterial(data);
    } catch (error) {
      console.error('Failed to fetch material:', error);
      // toast({
      //   variant: "destructive",
      //   title: "Error",
      //   description: "Failed to load material details",
      // });
      navigate({ to: '/admin/materials' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMappingSelect = async (mapping: MaterialMapping) => {
    if (!material) return;
    
    if (mapping.id) {
      setPendingMapping(mapping);
      setConfirmMappingDialogOpen(true);
      return;
    }
    
    await processMappingSelect(mapping);
  };
  
  const processMappingSelect = async (mapping: MaterialMapping) => {
    if (!material) return;
    
    try {
      setProcessingId(mapping.id || 'remove');
      setIsMappingLoading(true);
      
      if (!mapping.id) {
        await adminService.removeMaterialGlobalMapping(material.id);
        setMaterial(prev => {
          if (!prev) return null;
          return {
            ...prev,
            isMapped: false,
            mappingId: null,
            mappingInfo: null
          };
        });
        
        // toast({
        //   title: "Success",
        //   description: "Material mapping removed successfully",
        // });
      } else {
        const result = await adminService.matchMaterialGlobal(material.id, mapping.id);
        
        if (result.success) {
          setMaterial(prev => {
            if (!prev) return null;
            return {
              ...prev,
              isMapped: true,
              mappingId: mapping.id,
              mappingInfo: {
                materialPattern: mapping.materialPattern,
                activityName: mapping.activityName,
                finalProduct: mapping.finalProduct
              }
            };
          });
          
          // toast({
          //   title: "Success",
          //   description: "Material mapping updated successfully",
          // });
        }
      }
    } catch (error) {
      console.error('Error updating material mapping:', error);
      // toast({
      //   variant: "destructive",
      //   title: "Error",
      //   description: "Failed to update material mapping",
      // });
    } finally {
      setProcessingId(null);
      setIsMappingLoading(false);
    }
  };

  const handleCreateMapping = async (data: CreateMaterialMappingDto | UpdateMaterialMappingDto) => {
    try {
      const newMapping = await materialMappingsService.create(data as CreateMaterialMappingDto);
      // toast({
      //   title: "Success",
      //   description: "Material mapping created successfully",
      // });
      setIsCreateDialogOpen(false);
      
      // Refresh mappings list
      refresh();
      
      // Optionally, apply the new mapping to the current material
      if (material && newMapping.id) {
        await processMappingSelect({
          id: newMapping.id,
          materialPattern: newMapping.materialPattern,
          activityName: newMapping.activityName,
          finalProduct: newMapping.finalProduct,
          alternateNames: newMapping.alternateNames || [],
          referenceProduct: newMapping.referenceProduct || ''
        });
      }
    } catch (error) {
      console.error('Failed to create material mapping:', error);
      // toast({
      //   variant: "destructive",
      //   title: "Error",
      //   description: "Failed to create material mapping",
      // });
    }
  };

  if (isLoading || !material) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Loading material details...</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => navigate({ to: '/admin/materials' })}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to materials
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{material.name}</CardTitle>
                {material.description && (
                  <CardDescription>{material.description}</CardDescription>
                )}
              </div>
              {material.isMapped ? (
                <Badge variant="success">Mapped</Badge>
              ) : (
                <Badge variant="secondary">Not Mapped</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Products Using This Material</h3>
                  <p className="mt-1 text-lg">{material.recentProducts?.length || 0}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
                  <p className="mt-1 text-lg">
                    {new Date(material.updatedAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              {material.mappingInfo && (
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-sm font-medium text-muted-foreground">Current Mapping</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Pattern</div>
                      <div className="font-medium">{material.mappingInfo.materialPattern}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Activity</div>
                      <div className="font-medium">{material.mappingInfo.activityName}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Type</div>
                      <div className="font-medium">
                        {material.mappingInfo.finalProduct ? 'Final Product' : 'Intermediate'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {material.recentProducts && material.recentProducts.length > 0 && (
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-sm font-medium text-muted-foreground">Recent Products Using This Material</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 font-medium">Product Name</th>
                          <th className="text-left py-2 font-medium">Reference</th>
                          <th className="text-left py-2 font-medium">Category</th>
                          <th className="text-right py-2 font-medium">Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {material.recentProducts.map((product) => (
                          <tr key={product.id} className="border-b hover:bg-muted/50">
                            <td className="py-2">
                              <Link 
                                to="/admin/products/$id"
                                params={{ id: product.id }}
                                className="text-primary hover:underline font-medium"
                              >
                                {product.name}
                              </Link>
                            </td>
                            <td className="py-2">{product.reference}</td>
                            <td className="py-2">{product.category}</td>
                            <td className="py-2 text-right">
                              {product.quantity} {product.unit}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Activity Mappings</h2>
            <Button onClick={() => setIsCreateDialogOpen(true)} disabled={isMappingLoading}>
              Create New Mapping
            </Button>
          </div>

          {isMappingLoading && (
            <div className="bg-muted/30 rounded-md p-4 flex items-center justify-center">
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span>Updating material mapping...</span>
              </div>
            </div>
          )}

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Available Mappings</CardTitle>
              <CardDescription>
                Select a mapping to associate with this material or create a new one.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MaterialMappingList
                mappings={mappings}
                loading={mappingsLoading}
                onSelect={handleMappingSelect}
                processingId={processingId}
                searchQuery={searchQuery}
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                pageSize={pageSize}
                onSearchChange={setSearchQuery}
                onPageChange={setCurrentPage}
                selectedId={material?.mappingId || null}
                disabled={isMappingLoading}
              />
            </CardContent>
          </Card>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Material Mapping</DialogTitle>
            </DialogHeader>
            <MaterialMappingForm onSubmit={handleCreateMapping} />
          </DialogContent>
        </Dialog>
      </div>
      
      <ConfirmDialog
        open={confirmMappingDialogOpen}
        onOpenChange={setConfirmMappingDialogOpen}
        title="Confirmation de mise à jour"
        description="Cette action mettra à jour tous les matériaux de produit utilisant ce matériau pour tous les clients. Voulez-vous continuer?"
        onConfirm={() => {
          if (pendingMapping) {
            processMappingSelect(pendingMapping);
            setPendingMapping(null);
          }
        }}
        onCancel={() => {
          setPendingMapping(null);
        }}
      />
    </>
  );
} 