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
import { MaterialMapping } from '@/interfaces/materialMapping';
import { useMaterialMappings } from '@/hooks/useMaterialMappings';
import { Link } from 'lucide-react';

interface MaterialMappingPanelProps {
  materialId: string;
  currentMappingId?: string;
  onMappingSelect: (mapping: MaterialMapping) => void;
}

export function MaterialMappingPanel({
  materialId,
  currentMappingId,
  onMappingSelect,
}: MaterialMappingPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { mappings, loading, search } = useMaterialMappings();

  const handleSelect = (mapping: MaterialMapping) => {
    onMappingSelect(mapping);
    setIsOpen(false);
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
            Select a mapping to link with this material
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          <MaterialMappingList
            mappings={mappings}
            loading={loading}
            onSelect={handleSelect}
            onSearch={search}
            selectedId={currentMappingId}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
} 