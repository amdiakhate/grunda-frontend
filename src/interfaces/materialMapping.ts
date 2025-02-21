export interface MaterialMapping {
  id: string;
  activityUuid: string;
  activityName: string;
  materialPattern: string;
  alternateNames?: string;
  materialsCount: number;
  comment?: string;
  finalProduct: boolean;
  transform?: string;
  unit?: string;
  origin?: string;
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