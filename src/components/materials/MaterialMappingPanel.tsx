import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { MaterialMappingList } from './MaterialMappingList';
import { MaterialMappingForm } from './MaterialMappingForm';
import { MaterialMapping, CreateMaterialMappingDto, UpdateMaterialMappingDto } from '@/interfaces/materialMapping';
import { useMaterialMappings } from '@/hooks/useMaterialMappings';
import { Link } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { materialMappingsService } from '@/services/materialMappings';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const {
    mappings,
    loading,
    searchQuery,
    currentPage,
    totalPages,
    setSearchQuery,
    setCurrentPage,
    refetch,
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
      toast({
        title: "Success",
        description: "Material mapping created successfully",
      });
      await refetch();
      handleSelect(newMapping);
    } catch (error) {
      console.error('Failed to create mapping:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create material mapping",
      });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Link className="h-4 w-4 mr-2" />
          {currentMappingId ? 'Change Mapping' : 'Add Mapping'}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[800px] sm:max-w-[800px]">
        <SheetHeader>
          <SheetTitle>Material Mappings</SheetTitle>
          <SheetDescription>
            Select an existing mapping or create a new one
          </SheetDescription>
        </SheetHeader>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'search' | 'create')} className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="search">Search Existing</TabsTrigger>
            <TabsTrigger value="create">Create New</TabsTrigger>
          </TabsList>
          <TabsContent value="search" className="mt-4">
            <MaterialMappingList
              mappings={mappings}
              loading={loading}
              onSelect={handleSelect}
              onSearch={handleSearch}
              selectedId={currentMappingId}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              searchQuery={searchQuery}
            />
          </TabsContent>
          <TabsContent value="create" className="mt-4">
            <MaterialMappingForm onSubmit={handleCreateMapping} />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
} 