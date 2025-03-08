import { useState, useEffect } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import { adminService } from '@/services/admin';
import { MaterialMappingList } from '@/components/materials/MaterialMappingList';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { MaterialMapping } from '@/interfaces/materialMapping';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMaterialMappings } from '@/hooks/useMaterialMappings';

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
}

function MaterialDetailsPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [material, setMaterial] = useState<RawMaterial | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const {
    mappings,
    loading: mappingsLoading,
    searchQuery,
    currentPage,
    totalPages,
    setSearchQuery,
    setCurrentPage,
  } = useMaterialMappings();

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
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load material details",
      });
      navigate({ to: '/admin/materials' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMappingSelect = async (mapping: MaterialMapping) => {
    if (!material) return;
    
    try {
      setProcessingId(material.id);
      
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
        
        toast({
          title: "Success",
          description: "Material mapping removed successfully",
        });
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
          
          toast({
            title: "Success",
            description: "Material mapping updated successfully",
          });
        }
      }
    } catch (error) {
      console.error('Error updating material mapping:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update material mapping",
      });
    } finally {
      setProcessingId(null);
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
                <p className="mt-1 text-lg">{material.product_affected}</p>
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
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Activity Mappings</h2>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            Create New Mapping
          </Button>
        </div>

        <MaterialMappingList
          mappings={mappings}
          loading={mappingsLoading}
          onSelect={handleMappingSelect}
          processingId={processingId}
          searchQuery={searchQuery}
          currentPage={currentPage}
          totalPages={totalPages}
          onSearchChange={setSearchQuery}
          onPageChange={setCurrentPage}
          selectedId={material?.mappingId || null}
        />
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create New Material Mapping</DialogTitle>
          </DialogHeader>
          {/* Ici, nous pourrions ajouter un formulaire pour créer un nouveau mapping */}
        </DialogContent>
      </Dialog>
    </div>
  );
} 