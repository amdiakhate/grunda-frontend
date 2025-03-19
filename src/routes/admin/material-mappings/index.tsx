import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useMaterialMappings } from '@/hooks/useMaterialMappings';
import { MaterialMappingForm } from '@/components/materials/MaterialMappingForm';
import { materialMappingsService } from '@/services/materialMappings';
import { CreateMaterialMappingDto, UpdateMaterialMappingDto, MaterialMapping } from '@/interfaces/materialMapping';
import { AdminPageLayout } from '@/components/admin/AdminPageLayout';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { SearchInput } from '@/components/admin/SearchInput';
import { AdminTable } from '@/components/admin/AdminTable';
import { AdminTableFooter } from '@/components/admin/AdminTableFooter';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useState } from 'react';

export const Route = createFileRoute('/admin/material-mappings/')({
  component: MaterialMappingsPage,
});

function MaterialMappingsPage() {
  const {
    mappings,
    loading,
    searchQuery,
    currentPage,
    totalPages,
    setSearchQuery,
    setCurrentPage,
    refresh,
  } = useMaterialMappings();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const loadMappings = async () => {
    try {
      refresh();
    } catch {
      // toast({
      //   variant: "destructive",
      //   title: "Error",
      //   description: "Failed to load material mappings",
      // });
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = async (id: string) => {
    try {
      await materialMappingsService.delete(id);
      // toast({
      //   title: "Success",
      //   description: "Material mapping deleted successfully",
      // });
      loadMappings();
    } catch {
        // toast({
        //   variant: "destructive",
        //   title: "Error",
        //   description: "Failed to delete material mapping",
        // });
    }
  };

  const handleCreateMapping = async (data: CreateMaterialMappingDto | UpdateMaterialMappingDto) => {
    try {
      await materialMappingsService.create(data as CreateMaterialMappingDto);
      // toast({
      //   title: "Success",
      //   description: "Material mapping created successfully",
      // });
      setIsCreateDialogOpen(false);
      loadMappings();
    } catch {
      // toast({
      //   variant: "destructive",
      //   title: "Error",
      //   description: "Failed to create material mapping",
      // });
    }
  };

  const columns = [
    {
      header: 'Pattern',
      accessorKey: 'materialPattern' as const,
      className: 'font-medium',
      cell: (item: MaterialMapping) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="font-medium cursor-help">
                {item.materialPattern}
                {item.alternateNames && item.alternateNames.length > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    +{item.alternateNames.length}
                  </Badge>
                )}
              </div>
            </TooltipTrigger>
            {item.alternateNames && item.alternateNames.length > 0 && (
              <TooltipContent>
                <p className="font-medium mb-1">Alternate Names:</p>
                <ul className="list-disc pl-4 space-y-1">
                  {item.alternateNames.map((name, index) => (
                    <li key={index}>{name}</li>
                  ))}
                </ul>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      header: 'Activity',
      accessorKey: 'activityName' as const,
    },
    {
      header: 'Reference Product',
      accessorKey: 'referenceProduct' as const,
    },
    {
      header: 'Type',
      accessorKey: 'finalProduct' as const,
      cell: (item: MaterialMapping) => (
        <Badge variant="secondary" className={item.finalProduct ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}>
          {item.finalProduct ? 'Final Product' : 'Intermediate'}
        </Badge>
      ),
    },
    {
      header: 'Linked Materials',
      accessorKey: 'materialsCount' as const,
      cell: (item: MaterialMapping) => (
        <Badge variant="secondary" className="bg-muted">
          {item.materialsCount}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      accessorKey: 'id' as const,
      className: 'text-right',
      cell: (item: MaterialMapping) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            asChild
          >
            <Link
              to="/admin/material-mappings/$id"
              params={{ id: item.id }}
            >
              Edit
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(item.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AdminPageLayout>
      <AdminPageHeader title="Common Library">
        <div className="flex items-center gap-4">
          <SearchInput
            placeholder="Search mappings..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            Create New
          </Button>
        </div>
      </AdminPageHeader>

      <AdminTable
        data={mappings}
        columns={columns}
        loading={loading}
        searchQuery={searchQuery}
        emptyMessage="No material mappings found"
      />

      <AdminTableFooter
        total={totalPages * 10}
        pageSize={10}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        itemsName="mappings"
      />

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Material Mapping</DialogTitle>
          </DialogHeader>
          <MaterialMappingForm onSubmit={handleCreateMapping} />
        </DialogContent>
      </Dialog>
    </AdminPageLayout>
  );
} 