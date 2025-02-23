export interface MaterialMapping {
  id: string;
  activityName: string;
  activityUuid: string;
  activityUnit?: string;
  activityOrigin?: string;
  referenceProduct?: string;
  materialPattern: string;
  alternateNames?: string;
  comment?: string;
  finalProduct?: boolean;
  materialsCount?: number;
  transform?: string;
  transformationActivityUuid?: string;
  transformationActivityName?: string;
  transformationActivityUnit?: string;
  transformationActivityOrigin?: string;
  transformationReferenceProduct?: string;
}

export interface MaterialMappingSearchParams {
  page?: number;
  pageSize?: number;
  query?: string;
}

export interface PaginatedMaterialMappings {
  items: MaterialMapping[];
  total: number;
} 