import { useState, useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Loader2, ArrowLeft } from 'lucide-react'
import { adminService } from '@/services/admin'
import { MaterialMappingList } from '@/components/materials/MaterialMappingList'
import { MaterialMappingForm } from '@/components/materials/MaterialMappingForm'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { materialMappingsService } from '@/services/materialMappings'
import type {
  MaterialMapping,
  CreateMaterialMappingDto,
  MaterialMappingListDto,
} from '@/interfaces/materialMapping'
import type { MaterialDetails, MaterialListItem } from '@/interfaces/admin'
import { useMaterialMappings } from '@/hooks/useMaterialMappings'
import { MaterialDetailsCard } from '@/components/materials/MaterialDetailsCard'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'

export const Route = createFileRoute('/admin/product-materials/$id')({
  component: MaterialDetailsPage,
})

function MaterialDetailsPage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [productMaterial, setProductMaterial] =
    useState<MaterialListItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const {
    mappings,
    loading: mappingsLoading,
    searchQuery,
    currentPage,
    totalPages,
    setSearchQuery,
    setCurrentPage,
  } = useMaterialMappings()
  const [confirmMappingDialogOpen, setConfirmMappingDialogOpen] = useState(false);
  const [pendingMapping, setPendingMapping] = useState<MaterialMapping | null>(null);

  useEffect(() => {
    if (id) {
      fetchMaterial()
    }
  }, [id])

  const fetchMaterial = async () => {
    if (!id) return
    try {
      setIsLoading(true)
      const data = await adminService.getMaterialById(id)
      setProductMaterial(data)
    } catch (error) {
      console.error('Failed to fetch material:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load material details',
      })
      navigate({ to: '/admin/materials' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleMappingSelect = async (mapping: MaterialMapping) => {
    if (!productMaterial) return

    // Si un mapping est fourni, afficher la boîte de dialogue de confirmation
    if (mapping.id) {
      setPendingMapping(mapping);
      setConfirmMappingDialogOpen(true);
      return;
    }
    
    // Sinon, procéder à la suppression du mapping
    await processMappingSelect(mapping);
  }
  
  const processMappingSelect = async (mapping: MaterialMapping) => {
    if (!productMaterial) return

    try {
      setProcessingId(productMaterial.id)

      if (!mapping.id) {
        await adminService.removeMaterialMapping(productMaterial.id)
        setProductMaterial((prev) =>
          prev
            ? {
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
              }
            : null,
        )

        toast({
          title: 'Success',
          description: 'Activity mapping removed successfully',
        })
      } else {
        const result = await adminService.matchMaterial(
          productMaterial.id,
          mapping.id,
        )

        if (result.success) {
          setProductMaterial((prev) =>
            prev
              ? {
                  ...prev,
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
                }
              : null,
          )

          toast({
            title: 'Success',
            description: 'Activity mapping updated successfully',
          })
        }
      }
    } catch (error) {
      console.error('Error updating material mapping:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update material mapping',
      })
    } finally {
      setProcessingId(null)
    }
  }

  if (isLoading || !productMaterial) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Loading material details...
        </p>
      </div>
    )
  }

  // Convertir MaterialListItem en MaterialDetails pour la compatibilité avec MaterialDetailsCard
  const materialDetails: MaterialDetails = {
    id: productMaterial.materialId,
    name: productMaterial.material.name,
    description: productMaterial.material.description,
    activityUuid: productMaterial.activityUuid,
    activityName: productMaterial.activityName,
    activityUnit: productMaterial.activityUnit,
    activityOrigin: productMaterial.activityOrigin,
    referenceProduct: productMaterial.referenceProduct,
    transformationActivityUuid: productMaterial.transformationActivityUuid,
    transformationActivityName: productMaterial.transformationActivityName,
    transformationActivityUnit: productMaterial.transformationActivityUnit,
    transformationActivityOrigin: productMaterial.transformationActivityOrigin,
    transformationReferenceProduct:
      productMaterial.transformationReferenceProduct,
    assembling_location: productMaterial.assembling_location,
    material_origin: productMaterial.material_origin,
    quantity: productMaterial.quantity,
    unit: productMaterial.unit,
    productId: productMaterial.productId,
    userId: '',
    userName: '',
    product_review_status: 'pending',
    createdAt: '',
    updatedAt: '',
    alternatives: [],
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          onClick={() => navigate({ to: '/admin/product-materials' })}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to materials
        </Button>
      </div>

      <MaterialDetailsCard
        material={materialDetails}
        materialBasic={productMaterial.material}
      />

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
          selectedId={productMaterial.activityUuid || null}
        />
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create New Material Mapping</DialogTitle>
          </DialogHeader>
          <MaterialMappingForm
            onSubmit={async (data) => {
              try {
                if ('id' in data && data.id) {
                  // Handle update case
                  const { id, ...updateData } = data as MaterialMappingListDto
                  await materialMappingsService.update(id, updateData)
                } else {
                  // Handle create case
                  const createData = data as CreateMaterialMappingDto
                  await materialMappingsService.create(createData)
                }
                setIsCreateDialogOpen(false)
                toast({
                  title: 'Success',
                  description: 'Material mapping created successfully',
                })
                // Reload mappings
                setCurrentPage(1)
                setSearchQuery('')
              } catch (error) {
                console.error('Error creating material mapping:', error)
                toast({
                  variant: 'destructive',
                  title: 'Error',
                  description: 'Failed to create material mapping',
                })
              }
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Dialogue de confirmation pour le mapping de matériau */}
      <ConfirmDialog
        open={confirmMappingDialogOpen}
        onOpenChange={setConfirmMappingDialogOpen}
        title="Confirmation de mise à jour"
        description="Cette action mettra à jour tous les matériaux de produit utilisant le même matériau pour tous les clients. Voulez-vous continuer?"
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
    </div>
  )
}
