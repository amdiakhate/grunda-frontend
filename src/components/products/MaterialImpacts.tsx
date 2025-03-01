import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MaterialImpacts as MaterialImpactsType } from "@/interfaces/product";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/stores/useStore";

interface MaterialImpactsProps {
  impacts: MaterialImpactsType;
}

export function MaterialImpacts({ impacts }: MaterialImpactsProps) {
  const { displayedImpact } = useStore();

  const formatNumber = (num: number) => {
    return num < 1 ? num.toExponential(2) : num.toFixed(2);
  };

  const getImpactValue = (type: 'main' | 'transformation') => {
    const impactsList = type === 'main' ? impacts.mainActivityImpacts : impacts.transformationActivityImpacts;
    const impact = impactsList.find(i => i.method === displayedImpact?.method);
    return impact ? {
      value: formatNumber(impact.value),
      unit: impact.unit,
      share: impact.share || 0
    } : null;
  };

  const mainImpact = getImpactValue('main');
  const transformationImpact = getImpactValue('transformation');

  if (!displayedImpact || (!mainImpact && !transformationImpact)) {
    return null;
  }

  return (
    <div className="grid gap-4 grid-cols-2">
      {mainImpact && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Main Activity Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{mainImpact.value}</p>
              <p className="text-sm text-muted-foreground">{mainImpact.unit}</p>
              <Badge variant="secondary" className="mt-2">
                Share: {mainImpact.share}%
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {transformationImpact && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Transformation Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{transformationImpact.value}</p>
              <p className="text-sm text-muted-foreground">{transformationImpact.unit}</p>
              <Badge variant="secondary" className="mt-2">
                Share: {transformationImpact.share}%
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 