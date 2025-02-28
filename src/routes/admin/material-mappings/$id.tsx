import { useEffect, useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { materialMappingsService } from '@/services/materialMappings';
import { MaterialMappingForm } from '@/components/materials/MaterialMappingForm';
import type { MaterialMappingListDto } from '@/interfaces/materialMapping';

export const Route = createFileRoute('/admin/material-mappings/$id')({
  component: EditMaterialMappingPage,
});

function EditMaterialMappingPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [mapping, setMapping] = useState<MaterialMappingListDto | null>(null);

  useEffect(() => {
    loadMapping();
  }, [id]);

  const loadMapping = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const data = await materialMappingsService.getById(id);
      console.log(data);
      setMapping(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load material mapping"
      });
      console.error(error);
      navigate({ to: '/admin/material-mappings' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!mapping) {
    return null;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Material Mapping</h1>
        <Button variant="outline" onClick={() => navigate({ to: '/admin/material-mappings' })}>
          Back to List
        </Button>
      </div>

      <Card className="p-6">
        <MaterialMappingForm
          initialData={mapping}
          onSubmit={async (data) => {
            try {
              await materialMappingsService.update(id, data);
              toast({
                title: "Success",
                description: "Material mapping updated successfully"
              });
              navigate({ to: '/admin/material-mappings' });
            } catch (error) {
              toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update material mapping"
              });
              console.error(error);
            }
          }}
        />
      </Card>
    </div>
  );
} 