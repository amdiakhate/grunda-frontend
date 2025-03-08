import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MaterialStatusBadge } from './MaterialStatusBadge';
import type { MaterialDetails, MaterialBasic } from '@/interfaces/admin';
import { MapPin, Scale, Factory } from 'lucide-react';

interface MaterialDetailsCardProps {
  material: MaterialDetails;
  materialBasic?: MaterialBasic;
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
  if (!uuid || !name) return null;
  
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="text-sm text-muted-foreground">Name</div>
          <div className="font-medium">{name}</div>
        </div>
        {unit && (
          <div>
            <div className="text-sm text-muted-foreground">Unit</div>
            <div className="font-medium">{unit}</div>
          </div>
        )}
        {location && (
          <div>
            <div className="text-sm text-muted-foreground">Location</div>
            <div className="font-medium">{location}</div>
          </div>
        )}
        {referenceProduct && (
          <div>
            <div className="text-sm text-muted-foreground">Reference Product</div>
            <div className="font-medium">{referenceProduct}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export function MaterialDetailsCard({ material, materialBasic }: MaterialDetailsCardProps) {
  // Utiliser materialBasic si fourni, sinon utiliser les propriétés de material
  const name = materialBasic ? materialBasic.name : material.name;
  const description = materialBasic ? materialBasic.description : material.description;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{name}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {material.product_review_status && (
            <MaterialStatusBadge status={material.product_review_status} />
          )}
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