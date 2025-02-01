import { ImpactResult } from "../../interfaces/product"
import { useStore } from "../../stores/useStore";
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Info, Star, SlidersHorizontal, ChevronRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "../ui/badge";

interface ImpactMethod {
  method: string;
  name: string;
  unit: string;
  description: string;
  category: string;
}

const impactMethods: ImpactMethod[] = [
  {
    method: 'acidification',
    name: 'Acidification',
    unit: 'mol H+ eq',
    category: 'Ecosystem Quality',
    description: 'Measures the potential increase in acidity of soil and water systems, which can harm ecosystems. Caused by emissions of substances like sulfur dioxide and nitrogen oxides.'
  },
  {
    method: 'climate change',
    name: 'Climate Change',
    unit: 'kg CO2 eq',
    category: 'Climate',
    description: 'Evaluates contribution to global warming through greenhouse gas emissions. Uses GWP100 (Global Warming Potential over 100 years) as reference.'
  },
  {
    method: 'ecotoxicity: freshwater',
    name: 'Freshwater Ecotoxicity',
    unit: 'CTUe',
    category: 'Ecosystem Quality',
    description: 'Assesses potential toxic effects on freshwater ecosystems. Measured in Comparative Toxic Units for ecosystems (CTUe).'
  },
  {
    method: 'eutrophication: freshwater',
    name: 'Freshwater Eutrophication',
    unit: 'kg P eq',
    category: 'Ecosystem Quality',
    description: 'Measures excessive nutrient enrichment in freshwater systems, focusing on phosphorus compounds. Can lead to algal blooms and oxygen depletion.'
  },
  {
    method: 'eutrophication: marine',
    name: 'Marine Eutrophication',
    unit: 'kg N eq',
    category: 'Ecosystem Quality',
    description: 'Evaluates nutrient enrichment in marine environments, focusing on nitrogen compounds. Can cause algal blooms and affect marine ecosystems.'
  },
  {
    method: 'eutrophication: terrestrial',
    name: 'Terrestrial Eutrophication',
    unit: 'mol N eq',
    category: 'Ecosystem Quality',
    description: 'Assesses nutrient enrichment in soil systems. Can alter plant communities and affect biodiversity.'
  },
  {
    method: 'human toxicity: carcinogenic',
    name: 'Human Toxicity (Cancer)',
    unit: 'CTUh',
    category: 'Human Health',
    description: 'Evaluates potential cancer-related health impacts from toxic substances. Measured in Comparative Toxic Units for humans (CTUh).'
  },
  {
    method: 'human toxicity: non-carcinogenic',
    name: 'Human Toxicity (Non-Cancer)',
    unit: 'CTUh',
    category: 'Human Health',
    description: 'Assesses non-cancer health impacts from toxic substances. Includes various health effects excluding cancer.'
  },
  {
    method: 'ionising radiation: human health',
    name: 'Ionising Radiation',
    unit: 'kBq U235 eq',
    category: 'Human Health',
    description: 'Measures potential human exposure to ionizing radiation. Uses uranium-235 as reference for radiation exposure.'
  },
  {
    method: 'land use',
    name: 'Land Use',
    unit: 'Pt',
    category: 'Resources',
    description: 'Evaluates impacts on soil quality and biodiversity from land occupation and transformation.'
  },
  {
    method: 'ozone depletion',
    name: 'Ozone Depletion',
    unit: 'kg CFC-11 eq',
    category: 'Ecosystem Quality',
    description: 'Assesses potential damage to the ozone layer. Measured relative to CFC-11 (a reference ozone-depleting substance).'
  },
  {
    method: 'particulate matter formation',
    name: 'Particulate Matter',
    unit: 'disease inc.',
    category: 'Human Health',
    description: 'Evaluates health impacts from fine particles in the air. Measured in disease incidence rate.'
  },
  {
    method: 'photochemical oxidant formation: human health',
    name: 'Photochemical Ozone Formation',
    unit: 'kg NMVOC eq',
    category: 'Human Health',
    description: 'Measures formation of ground-level ozone ("smog") which affects human health. Based on NMVOC (Non-Methane Volatile Organic Compounds).'
  },
  {
    method: 'energy resources: non-renewable',
    name: 'Non-Renewable Energy Use',
    unit: 'MJ',
    category: 'Resources',
    description: 'Evaluates depletion of non-renewable energy resources like fossil fuels. Measured in energy content (MJ).'
  },
  {
    method: 'material resources: metals/minerals',
    name: 'Mineral Resource Use',
    unit: 'kg Sb eq',
    category: 'Resources',
    description: 'Assesses depletion of mineral resources. Uses antimony (Sb) as reference for resource scarcity.'
  },
  {
    method: 'water use',
    name: 'Water Scarcity',
    unit: 'm³ eq',
    category: 'Resources',
    description: 'Evaluates water consumption considering local water scarcity. Accounts for potential human health and ecosystem impacts.'
  }
];

// Définir les métriques principales
const keyMetrics = [
  'climate change',
  'water use',
  'energy resources: non-renewable',
  'human toxicity: carcinogenic',
];

export function ImpactFilter({ impactResults }: { impactResults: ImpactResult[] }) {
  const { displayedImpact, setDisplayedImpact } = useStore();

  // Grouper les méthodes par catégorie
  const groupedMethods = impactMethods.reduce((acc, method) => {
    if (!acc[method.category]) {
      acc[method.category] = [];
    }
    acc[method.category].push(method);
    return acc;
  }, {} as Record<string, ImpactMethod[]>);

  const renderMetricButton = (method: ImpactMethod) => {
    const isAvailable = impactResults.some(result => result.method === method.method);
    const isSelected = displayedImpact?.method === method.method;
    const isKeyMetric = keyMetrics.includes(method.method);

    return (
      <TooltipProvider key={method.method}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative">
              <Button
                variant={isSelected ? "default" : "outline"}
                className="w-full justify-start text-left"
                disabled={!isAvailable}
                onClick={() => setDisplayedImpact({ method: method.method, unit: method.unit })}
              >
                <div className="truncate flex-1">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{method.name}</span>
                    {isKeyMetric && <Star className="h-3 w-3 fill-primary" />}
                  </div>
                  <span className="text-xs text-muted-foreground block">
                    {method.unit}
                  </span>
                </div>
                <Info className="h-4 w-4 ml-2 shrink-0" />
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent side="left" className="max-w-[300px]">
            <div className="space-y-2">
              <p className="font-medium">{method.name}</p>
              <p className="text-sm">{method.description}</p>
              <p className="text-xs text-muted-foreground">Unit: {method.unit}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const currentMethod = impactMethods.find(m => m.method === displayedImpact?.method);

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1">
        {currentMethod ? (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-2 py-1">
              <span className="font-medium">{currentMethod.name}</span>
              <span className="text-xs text-muted-foreground ml-1">
                ({currentMethod.unit})
              </span>
            </Badge>
            {keyMetrics.includes(currentMethod.method) && (
              <Star className="h-3 w-3 fill-primary" />
            )}
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">Select an impact metric</span>
        )}
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Change Metric
            <ChevronRight className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Impact Metrics</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <Tabs defaultValue="key" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="key" className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Key Metrics
                </TabsTrigger>
                <TabsTrigger value="all">All Metrics</TabsTrigger>
              </TabsList>

              <TabsContent value="key" className="mt-0">
                <div className="grid grid-cols-1 gap-2">
                  {impactMethods
                    .filter(method => keyMetrics.includes(method.method))
                    .map(renderMetricButton)}
                </div>
              </TabsContent>

              <TabsContent value="all" className="mt-0">
                <ScrollArea className="h-[calc(100vh-200px)] pr-4">
                  <div className="space-y-6">
                    {Object.entries(groupedMethods).map(([category, methods]) => (
                      <div key={category} className="space-y-2">
                        <h3 className="font-medium text-sm text-muted-foreground">{category}</h3>
                        <div className="grid grid-cols-1 gap-2">
                          {methods.map(renderMetricButton)}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
