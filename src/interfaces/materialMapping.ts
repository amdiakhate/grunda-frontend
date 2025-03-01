export interface MaterialMapping {
  id: string;
  materialPattern: string;
  alternateNames: string[];
  referenceProduct: string;
  finalProduct: boolean;
  activityName: string;
  transformationActivityName?: string;
  density?: number;
  lossRate?: number;
  comment?: string;
  materialsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMaterialMappingDto {
  materialPattern: string;
  alternateNames: string[];
  referenceProduct: string;
  finalProduct: boolean;
  activityName: string;
  transformationActivityName?: string;
  density?: number;
  lossRate?: number;
}

export interface UpdateMaterialMappingDto {
  materialPattern?: string;
  alternateNames?: string[];
  referenceProduct?: string;
  finalProduct?: boolean;
  activityName?: string;
  transformationActivityName?: string;
  density?: number;
  lossRate?: number;
}

export interface MaterialMappingListDto {
  id: string;
  materialPattern: string;
  alternateNames: string[];
  referenceProduct: string;
  comment?: string;
  materialsCount: number;
  activityName: string;
  finalProduct: boolean;
  transformationActivityName?: string;
  density?: number;
  lossRate?: number;
  createdAt: string;
  updatedAt: string;
}

export type SortField = 'materialPattern' | 'activityName' | 'materialsCount' | 'createdAt' | 'updatedAt';
export type SortOrder = 'asc' | 'desc';

export interface MaterialMappingSearchParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: SortField;
  sortOrder?: SortOrder;
}

export interface PaginatedMaterialMappings {
  items: MaterialMappingListDto[];
  total: number;
  page: number;
  pageSize: number;
} 