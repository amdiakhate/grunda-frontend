import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MaterialMappingList } from './MaterialMappingList';
import { MaterialMappingForm } from './MaterialMappingForm';
import { MaterialMapping, CreateMaterialMappingDto, UpdateMaterialMappingDto } from '@/interfaces/materialMapping';
import { useMaterialMappings } from '@/hooks/useMaterialMappings';
import { Link } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { materialMappingsService } from '@/services/materialMappings';

interface MaterialMappingPanelProps {
  materialId: string;
  currentMappingId?: string;
  onMappingSelect: (mapping: MaterialMapping) => void;
}

export function MaterialMappingPanel({
  currentMappingId,
  onMappingSelect,
}: MaterialMappingPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'create'>('search');
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

  const handleSelect = (mapping: MaterialMapping) => {
    onMappingSelect(mapping);
    setIsOpen(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCreateMapping = async (data: CreateMaterialMappingDto | UpdateMaterialMappingDto) => {
    try {
      const newMapping = await materialMappingsService.create(data as CreateMaterialMappingDto);
      await refresh();
      handleSelect(newMapping);
    } catch (error) {
      console.error('Failed to create mapping:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Link className="h-4 w-4 mr-2" />
          {currentMappingId ? 'Change Mapping' : 'Add Mapping'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col gap-0 p-0">
        <div className="p-6 pb-2">
          <DialogHeader>
            <DialogTitle>Material Mappings</DialogTitle>
            <DialogDescription>
              Select an existing mapping or create a new one
            </DialogDescription>
          </DialogHeader>
        </div>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'search' | 'create')} className="flex-1">
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="search">Search Existing</TabsTrigger>
              <TabsTrigger value="create">Create New</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="search" className="mt-2 px-6 pb-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
            <MaterialMappingList
              mappings={mappings}
              loading={loading}
              onSelect={handleSelect}
              processingId={null}
              searchQuery={searchQuery}
              onSearchChange={handleSearch}
              selectedId={currentMappingId || null}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </TabsContent>
          
          <TabsContent value="create" className="mt-2 px-6 pb-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
            <MaterialMappingForm onSubmit={handleCreateMapping} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
} 