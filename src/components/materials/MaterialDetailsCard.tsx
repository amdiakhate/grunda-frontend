import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MaterialStatusBadge } from './MaterialStatusBadge';
import type { MaterialDetails } from '@/interfaces/admin';
import { MapPin, Scale, Factory } from 'lucide-react';

interface MaterialDetailsCardProps {
  material: MaterialDetails;
}

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | undefined;
}

function DetailItem({ icon, label, value }: DetailItemProps) {
  if (!value) return null;
  
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 text-muted-foreground">{icon}</div>
      <div>
        <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
        <dd className="mt-1 text-lg">{value}</dd>
      </div>
    </div>
  );
}

interface ActivityDetailsProps {
  title: string;
  uuid?: string;
  name?: string;
  unit?: string;
  location?: string;
  referenceProduct?: string;
}

function ActivityDetails({ title, uuid, name, unit, location, referenceProduct }: ActivityDetailsProps) {
  if (!uuid) return null;

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-sm text-muted-foreground">{title}</h4>
      <div className="bg-muted/50 rounded-lg p-4 space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">Activity ID</Badge>
          <span className="font-mono text-sm">{uuid}</span>
        </div>
        {name && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">Name</Badge>
            <span>{name}</span>
          </div>
        )}
        {unit && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">Unit</Badge>
            <span>{unit}</span>
          </div>
        )}
        {location && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">Location</Badge>
            <span>{location}</span>
          </div>
        )}
        {referenceProduct && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">Reference Product</Badge>
            <span>{referenceProduct}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function MaterialDetailsCard({ material }: MaterialDetailsCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{material.name}</CardTitle>
            <CardDescription>{material.description}</CardDescription>
          </div>
          <MaterialStatusBadge status={material.product_review_status} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DetailItem
              icon={<Scale className="h-4 w-4" />}
              label="Quantity"
              value={material.quantity ? `${material.quantity} ${material.unit}` : undefined}
            />
            <DetailItem
              icon={<Factory className="h-4 w-4" />}
              label="Assembling Location"
              value={material.assembling_location}
            />
            <DetailItem
              icon={<MapPin className="h-4 w-4" />}
              label="Material Origin"
              value={material.material_origin}
            />
          </div>

          {material.activityUuid && (
            <div className="space-y-4 pt-4 border-t">
              <ActivityDetails
                title="Current Activity"
                uuid={material.activityUuid}
                name={material.activityName}
                unit={material.activityUnit}
                location={material.activityOrigin}
                referenceProduct={material.referenceProduct}
              />
              
              {material.transformationActivityUuid && (
                <ActivityDetails
                  title="Transformation Activity"
                  uuid={material.transformationActivityUuid}
                  name={material.transformationActivityName}
                  unit={material.transformationActivityUnit}
                  location={material.transformationActivityOrigin}
                  referenceProduct={material.transformationReferenceProduct}
                />
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 