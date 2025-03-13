import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { ActivitySearch } from './ActivitySearch';
import type { CreateMaterialMappingDto, UpdateMaterialMappingDto, MaterialMappingListDto } from '@/interfaces/materialMapping';

interface MaterialMappingFormProps {
  initialData?: MaterialMappingListDto;
  onSubmit: (data: CreateMaterialMappingDto | UpdateMaterialMappingDto) => Promise<void>;
}

export function MaterialMappingForm({ initialData, onSubmit }: MaterialMappingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<MaterialMappingListDto>>({
    materialPattern: initialData?.materialPattern || '',
    activityName: initialData?.activityName || '',
    finalProduct: initialData?.finalProduct || false,
    alternateNames: initialData?.alternateNames || [],
    referenceProduct: initialData?.referenceProduct || '',
    transformationActivityName: initialData?.transformationActivityName || '',
    density: initialData?.density,
    lossRate: initialData?.lossRate,
  });
  const [lossRateInput, setLossRateInput] = useState(initialData?.lossRate != null ? String(initialData.lossRate) : '');
  const [densityInput, setDensityInput] = useState(initialData?.density != null ? String(initialData.density) : '');
  const [alternateName, setAlternateName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Convertir le taux de perte et la densité en nombres avant la soumission
      const dataToSubmit = { ...formData };
      
      if (lossRateInput) {
        // Remplacer la virgule par un point si nécessaire
        const normalizedValue = lossRateInput.replace(',', '.');
        const lossRateValue = parseFloat(normalizedValue);
        
        if (!isNaN(lossRateValue)) {
          dataToSubmit.lossRate = lossRateValue;
        }
      } else {
        dataToSubmit.lossRate = undefined;
      }
      
      if (densityInput) {
        // Remplacer la virgule par un point si nécessaire
        const normalizedValue = densityInput.replace(',', '.');
        const densityValue = parseFloat(normalizedValue);
        
        if (!isNaN(densityValue)) {
          dataToSubmit.density = densityValue;
        }
      } else {
        dataToSubmit.density = undefined;
      }
      
      await onSubmit(dataToSubmit as CreateMaterialMappingDto);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addAlternateName = () => {
    if (alternateName && !formData.alternateNames?.includes(alternateName)) {
      setFormData(prev => ({
        ...prev,
        alternateNames: [...(prev.alternateNames || []), alternateName],
      }));
      setAlternateName('');
    }
  };

  const removeAlternateName = (name: string) => {
    setFormData(prev => ({
      ...prev,
      alternateNames: prev.alternateNames?.filter(n => n !== name) || [],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="materialPattern">Material Pattern</Label>
        <Input
          id="materialPattern"
          value={formData.materialPattern || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, materialPattern: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="alternateName">Alternate Names</Label>
        <div className="flex gap-2 mb-2">
          <Input
            id="alternateName"
            value={alternateName}
            onChange={(e) => setAlternateName(e.target.value)}
            placeholder="Add alternate name"
          />
          <Button type="button" onClick={addAlternateName}>Add</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.alternateNames?.map((name) => (
            <Badge
              key={name}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => removeAlternateName(name)}
            >
              {name} ×
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <Label>Main Activity</Label>
        <div className="space-y-2">
          {formData.activityName ? (
            <div className="p-4 border rounded-lg">
              <div className="font-medium">{formData.activityName}</div>
              <div className="text-sm text-muted-foreground mt-1">
                Reference Product: {formData.referenceProduct}
              </div>
              <div className="flex justify-end mt-2">
                <ActivitySearch
                  trigger={<Button type="button" variant="outline" size="sm">Change Activity</Button>}
                  onSelect={(activity) => {
                    setFormData(prev => ({
                      ...prev,
                      activityName: activity.name,
                      referenceProduct: activity.referenceProduct,
                    }));
                  }}
                />
              </div>
            </div>
          ) : (
            <ActivitySearch
              onSelect={(activity) => {
                setFormData(prev => ({
                  ...prev,
                  activityName: activity.name,
                  referenceProduct: activity.referenceProduct,
                }));
              }}
            />
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="finalProduct"
          checked={formData.finalProduct}
          onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, finalProduct: checked }))}
        />
        <Label htmlFor="finalProduct">Final Product</Label>
      </div>

      {!formData.finalProduct && (
        <div>
          <Label>Transformation Activity</Label>
          <div className="space-y-2">
            {formData.transformationActivityName ? (
              <div className="p-4 border rounded-lg">
                <div className="font-medium">{formData.transformationActivityName}</div>
                <div className="flex justify-end mt-2">
                  <ActivitySearch
                    trigger={<Button type="button" variant="outline" size="sm">Change Activity</Button>}
                    onSelect={(activity) => {
                      setFormData(prev => ({
                        ...prev,
                        transformationActivityName: activity.name,
                      }));
                    }}
                  />
                </div>
              </div>
            ) : (
              <ActivitySearch
                onSelect={(activity) => {
                  setFormData(prev => ({
                    ...prev,
                    transformationActivityName: activity.name,
                  }));
                }}
              />
            )}
          </div>
        </div>
      )}

      <div>
        <Label htmlFor="density">Density (kg/m³)</Label>
        <Input
          id="density"
          type="text"
          placeholder="0.00"
          value={densityInput}
          onChange={(e) => setDensityInput(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="lossRate">Loss Rate (%)</Label>
        <Input
          id="lossRate"
          type="text"
          placeholder="0.006"
          value={lossRateInput}
          onChange={(e) => setLossRateInput(e.target.value)}
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {initialData ? 'Update' : 'Create'} Material Mapping
      </Button>
    </form>
  );
} 